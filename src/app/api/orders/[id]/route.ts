import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateOTP } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      partner: { select: { id: true, shopName: true, city: true, lat: true, lng: true } },
      orderItems: { include: { serviceListing: { include: { category: true } } } },
      deliveryTasks: { include: { agent: { include: { user: { select: { name: true, phone: true } } } } } },
      payment: true,
      reviews: true,
      dropAddress: true,
      pickupAddress: true,
    },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // RBAC: only owner, relevant partner, agent, or admin can see
  const isOwner = order.customerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  const isPartner = session.user.role === "PARTNER" && order.partner.id !== undefined;
  if (!isOwner && !isAdmin && !isPartner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { status, rejectionReason, outputFileUrls } = await req.json();

  const order = await prisma.order.findUnique({ where: { id }, include: { partner: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Status transition validation
  const PARTNER_ALLOWED = ["ACCEPTED", "REJECTED", "IN_PROGRESS", "COMPLETED", "AWAITING_PICKUP", "OUT_FOR_DELIVERY"];
  const AGENT_ALLOWED = ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];
  const CUSTOMER_ALLOWED = ["CANCELLED"];
  const ADMIN_ALLOWED = Object.values({ ...PARTNER_ALLOWED, ...AGENT_ALLOWED, ...CUSTOMER_ALLOWED, REFUNDED: "REFUNDED" });

  const allowedStatuses =
    session.user.role === "ADMIN" ? ADMIN_ALLOWED :
    session.user.role === "PARTNER" ? PARTNER_ALLOWED :
    session.user.role === "DELIVERY_AGENT" ? AGENT_ALLOWED :
    CUSTOMER_ALLOWED;

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Status transition not allowed" }, { status: 403 });
  }

  // If accepting, create delivery task if delivery type
  const extraData: Record<string, unknown> = {};
  if (status === "ACCEPTED" && order.deliveryType === "DELIVERY") {
    await prisma.deliveryTask.create({
      data: {
        orderId: order.id,
        type: "PICKUP",
        otp: generateOTP(),
        pickupAddress: `${order.partner.city} - Partner Location`,
      },
    });
  }

  if (outputFileUrls) extraData.outputFileUrls = outputFileUrls;
  if (rejectionReason) extraData.rejectionReason = rejectionReason;

  const updated = await prisma.order.update({
    where: { id },
    data: { status, ...extraData },
  });

  return NextResponse.json({ order: updated });
}
