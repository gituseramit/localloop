import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatusBadge, PageHeader } from "@/components/ui";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  IndianRupee, Package, Star, TrendingUp, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import type { Metadata } from "next";
import AutoRefresh from "@/components/AutoRefresh";
import SystemStatusPulse from "@/components/SystemStatusPulse";

export const metadata: Metadata = { title: "Partner Dashboard" };

export default async function PartnerDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "PARTNER") redirect("/login");

  const partner = await prisma.partnerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      orders: {
        include: {
          customer: { select: { name: true } },
          orderItems: { include: { serviceListing: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!partner) redirect("/partner/register");
  if (!partner.isApproved) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 h-full text-center animate-fade-in group">
        <div className="w-24 h-24 rounded-3xl bg-surface-container-high flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
          <AlertCircle size={40} className="text-secondary opacity-80" />
        </div>
        <h2 className="text-3xl font-black text-on-surface tracking-tighter mb-2">Protocol Verification Required</h2>
        <p className="text-on-surface-variant font-medium opacity-60 max-w-sm leading-relaxed">Your service hub is currently undergoing facilities audit. Operational authorization will be granted within 24 standard cycles.</p>
        <Link href="/support" className="btn btn-secondary mt-10 font-bold border-surface-container-high">Contact System Admin</Link>
      </div>
    );
  }

  const orders = partner.orders;
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const totalEarnings = orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").reduce((s, o) => s + o.partnerEarning, 0);

  const STATS = [
    { label: "Active Sequences", value: pendingOrders.length, icon: <Clock size={22} />, trend: "Awaiting Action", color: "var(--secondary)" },
    { label: "Cycle Volume", value: todayOrders.length, icon: <Package size={22} />, trend: "Sync: 24h", color: "var(--primary)" },
    { label: "Yield (Lifetime)", value: formatCurrency(totalEarnings), icon: <IndianRupee size={22} />, trend: "Total Earnings", color: "#16a34a" },
    { label: "Quality Index", value: `${partner.rating.toFixed(1)} / 5.0`, icon: <Star size={22} />, trend: "Customer Rating", color: "#eab308" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <AutoRefresh interval={15000} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <span className="text-[0.65rem] font-black text-secondary uppercase tracking-[0.2em] opacity-80">Hub Operator Console</span>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">
              Operational Status: <span className="text-transparent bg-clip-text gradient-brand">{partner.shopName}</span>
           </h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Manage your document fulfillment throughput and asset yields.</p>
        </div>
        <div className="flex items-center gap-3">
           <SystemStatusPulse />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="card p-8 group overflow-hidden relative border-surface-container-high hover:border-secondary/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-secondary/5">
             <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                   {s.icon}
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">{s.label}</p>
                   <p className="text-3xl font-black text-on-surface tracking-tighter leading-none">{s.value}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 pt-4 border-t border-surface-container-high">
                <TrendingUp size={14} className="text-secondary opacity-60" />
                <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{s.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Operational Escalations (Pending orders) */}
      {pendingOrders.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-7 bg-secondary rounded-full" />
             <h2 className="text-2xl font-black text-on-surface tracking-tighter">System Triggers: Need Authorization ({pendingOrders.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="card p-6 flex flex-col gap-5 border-surface-container-high hover:border-secondary/30 transition-all group relative overflow-hidden bg-surface-container-low/30">
                <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/5 rounded-bl-[4rem]" />
                <div className="flex items-start justify-between">
                   <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Package size={22} className="text-secondary opacity-60" />
                   </div>
                   <div className="text-right">
                      <p className="text-[0.7rem] font-black text-on-surface font-mono opacity-80 uppercase tracking-tight mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                      <StatusBadge status="PENDING" size="sm" />
                   </div>
                </div>
                <div className="flex-1">
                   <p className="font-black text-on-surface text-lg leading-tight mb-1 truncate">{order.customer.name}</p>
                   <p className="text-[0.65rem] font-black text-secondary uppercase tracking-widest opacity-60 mb-3">{formatRelativeTime(order.createdAt)}</p>
                   <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70 line-clamp-2">
                     {order.orderItems.map((i) => i.serviceListing.name).join(", ")}
                   </p>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-surface-container-high">
                   <span className="text-xl font-black text-on-surface">{formatCurrency(order.totalAmount)}</span>
                   <Link href={`/partner/orders?id=${order.id}`} className="btn btn-secondary py-2.5 px-5 text-xs font-black shadow-sm hover:bg-secondary hover:text-white border-surface-container-high">
                      Authorize Access
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Log */}
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-on-surface tracking-tighter">Fulfillment History</h2>
           <Link href="/partner/orders" className="text-[0.7rem] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
              Full Archive <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
           </Link>
        </div>
        <div className="card p-0 overflow-hidden border-surface-container-high shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-high">
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Asset Sequence</th>
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Customer Node</th>
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Domain Services</th>
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Yield</th>
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-[0.7rem] font-black text-on-surface tracking-tighter opacity-70">
                       #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-black text-on-surface">{order.customer.name}</span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs text-on-surface-variant font-medium max-w-[200px] truncate opacity-70">
                         {order.orderItems.map((i) => i.serviceListing.name).join(", ")}
                       </p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[0.9rem] font-black text-secondary">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-8 py-5 font-bold">
                       <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[0.65rem] font-black text-on-surface-variant/40 uppercase tracking-widest">{formatRelativeTime(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
