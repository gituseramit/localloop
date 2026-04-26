import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatCard, PageHeader, EmptyState, StatusBadge } from "@/components/ui";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Package, IndianRupee, MapPin, Star, TrendingUp } from "lucide-react";
import AvailabilityToggle from "./AvailabilityToggle";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Delivery Dashboard" };

export default async function DeliveryDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "DELIVERY_AGENT") redirect("/login");

  const agent = await prisma.deliveryAgentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      deliveryTasks: {
        include: {
          order: {
            include: {
              customer: { select: { name: true, phone: true } },
              partner: { select: { shopName: true, city: true } },
            },
          },
        },
        orderBy: { assignedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!agent) redirect("/delivery/register");

  const tasks = agent.deliveryTasks;
  const pendingTasks = tasks.filter((t) => t.status === "ASSIGNED");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");
  const todayEarnings = completedTasks
    .filter((t) => new Date(t.completedAt ?? 0).toDateString() === new Date().toDateString())
    .length * 30; // ₹30/delivery flat for now

  const STATS = [
    { label: "Active Nodes", value: pendingTasks.length, icon: <Package size={22} />, trend: "Awaiting Logistics", color: "#f59e0b" },
    { label: "Total Asset Moves", value: agent.totalDeliveries, icon: <MapPin size={22} />, trend: "Lifetime History", color: "var(--primary)" },
    { label: "Cycle Yield", value: formatCurrency(todayEarnings), icon: <IndianRupee size={22} />, trend: "Current Shift", color: "#16a34a" },
    { label: "Service Grade", value: `${agent.rating.toFixed(1)} ★`, icon: <Star size={22} />, trend: "Logistics Excellence", color: "#eab308" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <span className="text-[0.65rem] font-black text-amber-500 uppercase tracking-[0.2em] opacity-80">Logistics Fleet Management</span>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">
              Duty Status: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{session.user.name?.split(" ")[0]}</span>
           </h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Fulfilling real-time document transfers in your assigned domain.</p>
        </div>
        <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-lg">
           <div className="flex flex-col">
              <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">System Availability</span>
              <AvailabilityToggle agentId={agent.id} isAvailable={agent.isAvailable} />
           </div>
        </div>
      </div>

      {/* KPI System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="card p-8 group overflow-hidden relative border-surface-container-high hover:border-amber-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-500/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                   {s.icon}
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">{s.label}</p>
                   <p className="text-3xl font-black text-on-surface tracking-tighter leading-none">{s.value}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 pt-4 border-t border-surface-container-high">
                <TrendingUp size={14} className="text-amber-600 opacity-60" />
                <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{s.trend}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Tactical Operation List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
           <h2 className="text-2xl font-black text-on-surface tracking-tighter">Tactical Assignments</h2>
        </div>
        {pendingTasks.length === 0 ? (
          <div className="card py-16 flex flex-col items-center justify-center text-center bg-surface-container-low/30 border-dashed border-2 border-surface-container-high animate-pulse">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
               <Package size={28} className="text-on-surface-variant opacity-20" />
            </div>
            <h3 className="text-lg font-black text-on-surface tracking-tight opacity-40">No Active Vectors Found</h3>
            <p className="text-xs text-on-surface-variant font-medium opacity-50 mt-2">Standing by for logistics assignments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingTasks.map((task) => (
              <div key={task.id} className="card p-0 flex flex-col border-surface-container-high hover:border-amber-500/30 transition-all group overflow-hidden shadow-xl bg-surface-container-low/20">
                <div className="flex items-center justify-between p-6 bg-surface-container-low border-b border-surface-container-high">
                   <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest shadow-sm ${
                        task.type === "PICKUP" ? "bg-primary text-white" : "bg-amber-600 text-white"
                      }`}>
                        {task.type === "PICKUP" ? "Pickup Protocol" : "Delivery Vector"}
                      </div>
                      <span className="text-[0.6rem] font-bold text-on-surface-variant/40 uppercase tracking-widest">{formatRelativeTime(task.assignedAt)}</span>
                   </div>
                   <p className="text-[0.7rem] font-black font-mono text-on-surface tracking-tighter">#{task.orderId.slice(-8).toUpperCase()}</p>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center z-10 border-4 border-white hidden md:flex">
                     <ChevronRight size={14} className="text-on-surface-variant opacity-40" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em]">Origin Hub</p>
                    <div className="space-y-1">
                       <p className="text-lg font-black text-on-surface leading-tight">{task.order.partner.shopName}</p>
                       <p className="text-xs text-on-surface-variant font-medium opacity-60">{task.pickupAddress ?? task.order.partner.city}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[0.6rem] font-black text-amber-600 uppercase tracking-[0.2em]">Destination Node</p>
                    <div className="space-y-1">
                       <p className="text-lg font-black text-on-surface leading-tight">{task.order.customer.name}</p>
                       <p className="text-xs text-on-surface-variant font-medium opacity-60">{task.dropAddress ?? "Customer Residential Node"}</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-surface-container-low/50 border-t border-surface-container-high flex items-center justify-between">
                   {task.otp ? (
                     <div className="flex items-center gap-4">
                        <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Auth Code:</span>
                        <span className="text-2xl font-mono font-black text-on-surface tracking-[0.2em]">{task.otp}</span>
                     </div>
                   ) : <div />}
                   <Link href={`/delivery/tasks/${task.id}`} className={`btn font-black text-xs py-3 px-8 shadow-brand ${
                     task.type === "PICKUP" ? "btn-primary" : "btn-secondary bg-amber-600"
                   }`}>
                      Initiate Protocol
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operation Log */}
      {completedTasks.length > 0 && (
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-on-surface tracking-tighter">Mission History</h2>
             <Link href="/delivery/tasks" className="text-[0.7rem] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
                View All Files <ChevronRight size={14} />
             </Link>
          </div>
          <div className="card p-0 overflow-hidden border-surface-container-high shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-high">
                    <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Log Code</th>
                    <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Protocol</th>
                    <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Target Node</th>
                    <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Fulfillment Time</th>
                    <th className="px-8 py-5 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {completedTasks.slice(0, 8).map((t) => (
                    <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-8 py-5 font-mono text-[0.7rem] font-black text-on-surface tracking-tighter opacity-60">
                         #{t.orderId.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-8 py-5">
                         <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[0.6rem] font-black uppercase tracking-widest inline-block border border-green-500/20">
                            {t.type} Complete
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-sm font-black text-on-surface">{t.order.customer.name}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[0.65rem] font-black text-on-surface-variant/40 uppercase tracking-widest">
                            {t.completedAt ? formatRelativeTime(t.completedAt) : "–"}
                         </span>
                      </td>
                      <td className="px-8 py-5 font-bold">
                         <span className="text-[0.9rem] font-black text-on-surface">₹30.00</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>; }
