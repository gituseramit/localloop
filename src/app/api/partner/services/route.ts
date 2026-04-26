import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const ServiceSchema = z.object({
  partnerId: z.string(),
  categoryId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  estimatedTime: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "PARTNER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = ServiceSchema.parse(body);
    const service = await prisma.serviceListing.create({ data });
    return NextResponse.json({ service }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 400 });
  }
}
