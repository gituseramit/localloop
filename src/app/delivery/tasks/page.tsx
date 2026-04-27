import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, MapPin, Clock } from "lucide-react";

export default async function DeliveryTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "DELIVERY_AGENT") {
    redirect("/login");
  }

  const prisma = new PrismaClient();
  const tasks = await prisma.order.findMany({
    where: { deliveryAgentId: session.user.id },
    include: { service: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-on-background tracking-tight">Active Matrix Tasks</h1>
          <p className="text-on-surface-variant mt-2">All dispatched physical payload operations assigned to your node.</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface-container border border-dashed border-outline-variant">
          <Package className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-on-surface">No assigned tasks</h3>
          <p className="text-on-surface-variant mt-2">Wait for local dispatches from the merchant networks.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {tasks.map(t => (
            <Link href={`/delivery/tasks/${t.id}`} key={t.id} className="p-6 rounded-3xl bg-surface flex flex-col gap-4 border border-surface-container-high hover:border-amber-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-[0.6rem] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-600 rounded-full">{t.status}</span>
                <span className="text-[0.65rem] text-on-surface-variant font-mono">ID: {t.id}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-amber-500 transition-colors">{t.service.title}</h3>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>Payload bounded for local address</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
