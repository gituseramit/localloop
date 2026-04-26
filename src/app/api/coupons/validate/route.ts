import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code, orderAmount } = await req.json();
  if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, error: "Invalid or expired coupon" });
  }
  if (coupon.usageCount >= coupon.maxUsage) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" });
  }
  if (orderAmount < coupon.minOrderAmount) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order amount ₹${coupon.minOrderAmount} required`,
    });
  }

  const discount = coupon.discountType === "FLAT"
    ? coupon.discountValue
    : Math.round((orderAmount * coupon.discountValue) / 100);

  return NextResponse.json({
    valid: true,
    discount,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: coupon.discountType === "FLAT"
      ? `₹${coupon.discountValue} off applied!`
      : `${coupon.discountValue}% off applied!`,
  });
}
