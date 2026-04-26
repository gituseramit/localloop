import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const ReviewSchema = z.object({
  orderId: z.string(),
  targetId: z.string(),
  targetType: z.enum(["PARTNER", "DELIVERY_AGENT"]),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = ReviewSchema.parse(body);

    // Verify the order belongs to this customer
    const order = await prisma.order.findUnique({ where: { id: data.orderId } });
    if (!order || order.customerId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const existing = await prisma.review.findFirst({
      where: { orderId: data.orderId, reviewerId: session.user.id, targetType: data.targetType },
    });
    if (existing) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });

    const review = await prisma.review.create({
      data: {
        orderId: data.orderId,
        reviewerId: session.user.id,
        targetId: data.targetId,
        targetType: data.targetType,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update average rating
    const avg = await prisma.review.aggregate({
      where: { targetId: data.targetId, targetType: data.targetType },
      _avg: { rating: true },
    });

    if (data.targetType === "PARTNER") {
      await prisma.partnerProfile.update({
        where: { id: data.targetId },
        data: { rating: avg._avg.rating ?? 0 },
      });
    } else {
      await prisma.deliveryAgentProfile.update({
        where: { id: data.targetId },
        data: { rating: avg._avg.rating ?? 0 },
      });
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
