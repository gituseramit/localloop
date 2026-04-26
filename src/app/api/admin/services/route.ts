import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    const cat = await prisma.serviceCategory.create({ data: body });
    return NextResponse.json({ category: cat }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Slug may already exist" }, { status: 400 });
  }
}
