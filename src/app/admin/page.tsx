import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatCard, PageHeader, StatusBadge } from "@/components/ui";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Users, Package, Store, IndianRupee, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, Zap
} from "lucide-react";
import type { Metadata } from "next";
import AutoRefresh from "@/components/AutoRefresh";
import SystemStatusPulse from "@/components/SystemStatusPulse";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [
    totalUsers, totalPartners, pendingPartners, totalOrders,
    recentOrders, totalRevenue, pendingDisputes,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.partnerProfile.count({ where: { isApproved: true } }),
    prisma.partnerProfile.count({ where: { isApproved: false } }),
    prisma.order.count(),
    prisma.order.findMany({
      include: {
        customer: { select: { name: true } },
        partner: { select: { shopName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.order.aggregate({ _sum: { platformFee: true }, where: { paymentStatus: "PAID" } }),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
  ]);

  const gmv = await prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } });

  const STATS = [
    { label: "Registered Customers", value: totalUsers.toLocaleString(), icon: <Users size={22} />, trend: "Active Nodes", color: "var(--primary)" },
    { label: "Verified Partners", value: totalPartners, icon: <Store size={22} />, trend: `${pendingPartners} in queue`, color: "var(--secondary)" },
    { label: "Throughput (Orders)", value: totalOrders.toLocaleString(), icon: <Package size={22} />, trend: "Real-time sync", color: "#16a34a" },
    { label: "Infrastructure Revenue", value: formatCurrency(totalRevenue._sum.platformFee ?? 0), icon: <IndianRupee size={22} />, trend: "Net Profit", color: "#eab308" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <AutoRefresh interval={10000} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <span className="text-[0.65rem] font-black text-primary uppercase tracking-[0.2em] opacity-80">Infrastructure Status</span>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">Global Controller Overview</h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Monitoring LocalLoop platform health and operational throughput.</p>
        </div>
        <div className="flex gap-3">
           <SystemStatusPulse />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="card p-8 group overflow-hidden relative border-surface-container-high hover:border-primary/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-primary/5">
             <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   {s.icon}
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">{s.label}</p>
                   <p className="text-3xl font-black text-on-surface tracking-tighter leading-none">{s.value}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 pt-4 border-t border-surface-container-high">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{s.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Critical System Notifications */}
      {(pendingPartners > 0 || pendingDisputes > 0) && (
        <div className="flex flex-wrap gap-4">
          {pendingPartners > 0 && (
            <Link href="/admin/partners" className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-amber-600 hover:bg-amber-500/10 transition-all group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                 <AlertTriangle size={18} />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-black tracking-tight leading-tight">{pendingPartners} Node{pendingPartners > 1 ? "s" : ""} Pending Verification</span>
                 <span className="text-[0.65rem] font-bold opacity-60 uppercase tracking-widest">Urgent: Review required</span>
              </div>
              <ChevronRight size={16} className="ml-4 opacity-40 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {pendingDisputes > 0 && (
            <Link href="/admin/disputes" className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-all group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                 <AlertTriangle size={18} />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-black tracking-tight leading-tight">{pendingDisputes} Escalation Protocol{pendingDisputes > 1 ? "s" : ""}</span>
                 <span className="text-[0.65rem] font-bold opacity-60 uppercase tracking-widest">Active: Support tickets</span>
              </div>
              <ChevronRight size={16} className="ml-4 opacity-40 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Real-time Order Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-on-surface tracking-tighter">Throughput Sequence</h2>
             <Link href="/admin/orders" className="text-[0.7rem] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
                All Logs <ChevronRight size={14} />
             </Link>
          </div>
          <div className="card p-0 overflow-hidden border-surface-container-high shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-high">
                    <th className="px-6 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Sequence ID</th>
                    <th className="px-6 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Customer Node</th>
                    <th className="px-6 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Asset Amount</th>
                    <th className="px-6 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">System Status</th>
                    <th className="px-6 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                         <span className="text-[0.7rem] font-black font-mono text-on-surface tracking-tighter">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-on-surface leading-tight">{order.customer.name}</span>
                            <span className="text-[0.6rem] font-bold text-on-surface-variant/40 uppercase tracking-widest">{order.partner.shopName}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-sm font-black text-primary">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="px-6 py-4">
                         <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-[0.65rem] font-bold text-on-surface-variant/50 uppercase tracking-widest">{formatRelativeTime(order.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Intelligence Panel */}
        <div className="space-y-8">
          <div className="card p-8 bg-on-background text-white border-none shadow-brand overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-10 blur-[60px]" />
            <h3 className="text-lg font-black tracking-tighter mb-6 flex items-center gap-2">
               <Zap size={18} className="text-primary" /> Core Metrics
            </h3>
            <div className="space-y-6">
              {[
                { label: "Total GMV Processed", value: formatCurrency(gmv._sum.totalAmount ?? 0), icon: <TrendingUp size={16} /> },
                { label: "Infrastructure Hubs", value: totalPartners, icon: <Store size={16} /> },
                { label: "System Load (Total Orders)", value: totalOrders, icon: <Package size={16} /> },
                { label: "Active Escalations", value: pendingDisputes, icon: <AlertTriangle size={16} />, alert: pendingDisputes > 0 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 group/item">
                  <div className="flex items-center justify-between">
                     <span className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 group-hover/item:text-primary transition-colors">
                        {item.icon} {item.label}
                     </span>
                     <span className={`text-sm font-black ${item.alert ? "text-red-500" : "text-white"}`}>{item.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-primary/40 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 border-surface-container-high shadow-xl">
            <h3 className="text-lg font-black text-on-surface tracking-tighter mb-6 uppercase tracking-widest text-[0.65rem] opacity-40">Command Center</h3>
            <div className="space-y-3">
              {[
                { href: "/admin/partners", label: "Verification Protocol", desc: "Audit pending service nodes", color: "text-amber-500" },
                { href: "/admin/orders", label: "Fleet Monitor", desc: "Track all real-time transitions", color: "text-primary" },
                { href: "/admin/coupons", label: "Economic Incentives", desc: "Configure global yield rates", color: "text-purple-500" },
                { href: "/admin/services", label: "Domain Allocation", desc: "Manage service expertise levels", color: "text-green-500" },
              ].map((action, idx) => (
                <Link key={idx} href={action.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high hover:border-primary/30 transition-all group shadow-sm">
                  <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-black ${action.color}`}>
                     {idx + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[0.7rem] font-black text-on-surface uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-[0.55rem] font-medium text-on-surface-variant/60 truncate mt-1">{action.desc}</p>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
