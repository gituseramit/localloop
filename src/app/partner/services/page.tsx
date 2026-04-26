import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import PartnerServiceManager from "./PartnerServiceManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Services — Partner" };

export default async function PartnerServicesPage() {
  const session = await auth();
  if (!session || session.user.role !== "PARTNER") redirect("/login");

  const partner = await prisma.partnerProfile.findUnique({ where: { userId: session.user.id } });
  if (!partner) redirect("/partner/register");

  const [services, categories] = await Promise.all([
    prisma.serviceListing.findMany({
      where: { partnerId: partner.id },
      include: { category: true },
      orderBy: { category: { sortOrder: "asc" } },
    }),
    prisma.serviceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="My Services" subtitle={`${services.length} listings`} />
      <PartnerServiceManager partner={partner} services={services as never} categories={categories} />
    </div>
  );
}
