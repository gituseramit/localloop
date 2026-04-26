import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { PLATFORM_COMMISSION_RATE, DEFAULT_DELIVERY_FEE } from "@/lib/constants";

const CreateOrderSchema = z.object({
  partnerId: z.string(),
  deliveryType: z.enum(["PICKUP", "DELIVERY", "SELF_COLLECT"]),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  dropAddressId: z.string().optional(),
  items: z.array(z.object({
    serviceListingId: z.string(),
    quantity: z.number().min(1),
    instructions: z.string().optional(),
    fileUrls: z.array(z.string()).optional(),
  })),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (session.user.role === "CUSTOMER") where.customerId = session.user.id;
  if (session.user.role === "PARTNER") {
    const partner = await prisma.partnerProfile.findUnique({ where: { userId: session.user.id } });
    if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    where.partnerId = partner.id;
  }
  if (session.user.role === "DELIVERY_AGENT") {
    const agent = await prisma.deliveryAgentProfile.findUnique({ where: { userId: session.user.id } });
    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    where.deliveryTasks = { some: { agentId: agent.id } };
  }
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        partner: { select: { id: true, shopName: true, city: true } },
        orderItems: { include: { serviceListing: { select: { name: true } } } },
        deliveryTasks: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Only customers can place orders" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = CreateOrderSchema.parse(body);

    // Fetch service listings and calculate totals
    const listings = await prisma.serviceListing.findMany({
      where: { id: { in: data.items.map((i) => i.serviceListingId) } },
    });

    const listingMap = new Map(listings.map((l) => [l.id, l]));
    let subtotal = 0;
    const itemsData = data.items.map((item) => {
      const listing = listingMap.get(item.serviceListingId);
      if (!listing) throw new Error(`Service not found: ${item.serviceListingId}`);
      subtotal += listing.price * item.quantity;
      return { ...item, unitPrice: listing.price };
    });

    // Coupon validation
    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } });
      if (coupon && coupon.isActive && coupon.usageCount < coupon.maxUsage) {
        if (subtotal >= coupon.minOrderAmount) {
          discountAmount = coupon.discountType === "FLAT"
            ? coupon.discountValue
            : (subtotal * coupon.discountValue) / 100;
          await prisma.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
        }
      }
    }

    const deliveryFee = data.deliveryType === "DELIVERY" ? DEFAULT_DELIVERY_FEE : 0;
    const totalAmount = Math.max(0, subtotal - discountAmount) + deliveryFee;
    const platformFee = (totalAmount * PLATFORM_COMMISSION_RATE) / 100;
    const partnerEarning = totalAmount - platformFee - deliveryFee;

    const order = await prisma.order.create({
      data: {
        customerId: session.user.id,
        partnerId: data.partnerId,
        status: "PENDING",
        totalAmount,
        platformFee,
        partnerEarning,
        deliveryFee,
        deliveryType: data.deliveryType,
        notes: data.notes,
        couponCode: data.couponCode,
        discountAmount,
        dropAddressId: data.dropAddressId,
        orderItems: {
          create: itemsData.map((item) => ({
            serviceListingId: item.serviceListingId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            instructions: item.instructions,
            fileUrls: item.fileUrls ?? [],
          })),
        },
        payment: {
          create: { amount: totalAmount, status: "PENDING", method: "RAZORPAY" },
        },
      },
      include: { orderItems: true, payment: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
