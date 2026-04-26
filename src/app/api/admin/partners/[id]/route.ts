import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { action } = await req.json();

  let data: Record<string, unknown> = {};
  if (action === "approve") data = { isApproved: true };
  else if (action === "reject") data = { isApproved: false };
  else if (action === "suspend") data = { isSuspended: true };
  else if (action === "unsuspend") data = { isSuspended: false };
  else return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  await prisma.partnerProfile.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
