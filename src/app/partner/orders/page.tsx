import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import PartnerOrdersList from "./PartnerOrdersList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partner Orders" };

export default async function PartnerOrdersPage() {
  const session = await auth();
  if (!session || session.user.role !== "PARTNER") redirect("/login");

  const partner = await prisma.partnerProfile.findUnique({ where: { userId: session.user.id } });
  if (!partner) redirect("/partner/register");

  const orders = await prisma.order.findMany({
    where: { partnerId: partner.id },
    include: {
      customer: { select: { name: true, phone: true, email: true } },
      orderItems: {
        include: { serviceListing: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Order Queue"
        subtitle={`${orders.length} total orders`}
      />
      <PartnerOrdersList orders={orders as never} />
    </div>
  );
}
