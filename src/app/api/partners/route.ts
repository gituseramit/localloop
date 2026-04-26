import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  const partners = await prisma.partnerProfile.findMany({
    where: {
      isApproved: true,
      isSuspended: false,
      ...(category && { serviceListings: { some: { category: { slug: category }, isActive: true } } }),
      ...(q && {
        OR: [
          { shopName: { contains: q, mode: "insensitive" } },
          { serviceListings: { some: { name: { contains: q, mode: "insensitive" } } } },
        ],
      }),
    },
    include: {
      serviceListings: {
        where: { isActive: true },
        include: { category: { select: { name: true, slug: true, icon: true } } },
      },
      user: { select: { name: true } },
    },
    orderBy: { rating: "desc" },
    take: 50,
  });

  return NextResponse.json({ partners });
}
