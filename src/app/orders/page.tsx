import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatusBadge, PageHeader, EmptyState } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Package, ChevronRight, Filter } from "lucide-react";
import type { Metadata } from "next";
import AutoRefresh from "@/components/AutoRefresh";
import SystemStatusPulse from "@/components/SystemStatusPulse";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const sp = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      customerId: session.user.id,
      ...(sp.status ? { status: sp.status as never } : {}),
    },
    include: {
      partner: { select: { shopName: true, city: true } },
      orderItems: { include: { serviceListing: { select: { name: true } } } },
      deliveryTasks: { select: { status: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const STATUS_FILTERS = [
    { label: "All Protocols", value: "" },
    { label: "In Transmission", value: "IN_PROGRESS" },
    { label: "Filled Assets", value: "DELIVERED" },
    { label: "Terminated", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <AutoRefresh interval={15000} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
           <span className="text-[0.65rem] font-black text-primary uppercase tracking-[0.2em] opacity-80">Operational History</span>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">My Logistics Stream</h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Track real-time document movements and service fulfillment states.</p>
        </div>
        <div className="flex gap-3">
           <SystemStatusPulse />
        </div>
      </div>

      {/* Tonal Filter System */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {STATUS_FILTERS.map((f) => {
          const active = (sp.status ?? "") === f.value;
          return (
            <Link key={f.value} href={f.value ? `/orders?status=${f.value}` : "/orders"}
              className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest border transition-all shadow-sm ${
                active
                  ? "bg-on-background text-white border-on-background"
                  : "bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-primary/40 hover:bg-white"
              }`}>
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-3xl bg-surface-container-high flex items-center justify-center mb-8 shadow-inner">
             <Package size={32} className="text-on-surface-variant opacity-20" />
          </div>
          <h3 className="text-2xl font-black text-on-surface tracking-tighter mb-2">No Vectors Active</h3>
          <p className="text-on-surface-variant font-medium opacity-60 max-w-xs mb-10 leading-relaxed">Your logistics stream is currently empty. Initiate a document service protocol to see updates here.</p>
          <Link href="/services" className="btn btn-primary px-10 py-4 shadow-brand font-black text-xs uppercase tracking-[0.2em]">Initiate Service</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}
              className="card group p-0 overflow-hidden border-surface-container-high hover:border-primary/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-primary/5 bg-surface-container-lowest relative">
              <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
              
              <div className="p-6 border-b border-surface-container-high bg-surface-container-low/30 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       <Package size={18} className="text-white" />
                    </div>
                    <span className="text-[0.7rem] font-black font-mono text-on-surface tracking-tighter opacity-80 uppercase">#{order.id.slice(-8).toUpperCase()}</span>
                 </div>
                 <StatusBadge status={order.status} size="sm" />
              </div>

              <div className="p-8 space-y-6">
                 <div>
                    <h3 className="text-xl font-black text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors">{order.partner.shopName}</h3>
                    <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{formatDate(order.createdAt)}</p>
                 </div>
                 
                 <div className="flex flex-wrap gap-1.5">
                    {order.orderItems.map((item, idx) => (
                       <span key={idx} className="px-3 py-1 rounded-lg bg-surface-container-high text-[0.6rem] font-black text-on-surface uppercase tracking-widest shadow-sm">
                          {item.serviceListing.name}
                       </span>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-surface-container-high">
                    <div className="flex flex-col">
                       <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Asset Amount</span>
                       <span className="text-lg font-black text-on-surface">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                       <span className="text-[0.65rem] font-black text-primary uppercase tracking-widest leading-none mt-0.5">Stream Details</span>
                       <ChevronRight size={16} className="text-primary opacity-60" />
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
