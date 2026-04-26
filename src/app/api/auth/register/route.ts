import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "PARTNER", "DELIVERY_AGENT"]),
  shopName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, ...(data.phone ? [{ phone: data.phone }] : [])] },
    });
    if (existing) return NextResponse.json({ error: "Email or phone already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role,
        ...(data.role === "CUSTOMER" && { customerProfile: { create: {} } }),
        ...(data.role === "PARTNER" && {
          partnerProfile: {
            create: {
              shopName: data.shopName ?? data.name,
              isApproved: false,
            },
          },
        }),
        ...(data.role === "DELIVERY_AGENT" && {
          deliveryAgentProfile: { create: {} },
        }),
      },
    });

    return NextResponse.json({ message: "Account created", userId: user.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
