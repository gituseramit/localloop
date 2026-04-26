import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui";
import AdminCategoryManager from "./AdminCategoryManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Service Categories — Admin" };

export default async function AdminServicesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const categories = await prisma.serviceCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <PageHeader title="Service Categories" subtitle="Manage the marketplace service taxonomy" />
      <AdminCategoryManager categories={categories} />
    </div>
  );
}
