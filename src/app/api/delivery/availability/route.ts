import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "DELIVERY_AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { agentId, isAvailable } = await req.json();
  await prisma.deliveryAgentProfile.update({
    where: { id: agentId },
    data: { isAvailable },
  });
  return NextResponse.json({ success: true });
}
