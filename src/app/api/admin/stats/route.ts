import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalCustomers, totalPartners, totalAgents,
    totalOrders, pendingOrders, revenueAgg, gmvAgg,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.partnerProfile.count({ where: { isApproved: true } }),
    prisma.deliveryAgentProfile.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { platformFee: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } }),
  ]);

  return NextResponse.json({
    totalCustomers,
    totalPartners,
    totalAgents,
    totalOrders,
    pendingOrders,
    platformRevenue: revenueAgg._sum.platformFee ?? 0,
    gmv: gmvAgg._sum.totalAmount ?? 0,
  });
}
