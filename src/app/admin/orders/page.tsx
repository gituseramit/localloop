import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader, StatusBadge, Avatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Orders — Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (sp.status) where.status = sp.status;
  if (sp.q) {
    where.OR = [
      { customer: { name: { contains: sp.q, mode: "insensitive" } } },
      { partner: { shopName: { contains: sp.q, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { name: true, email: true } },
        partner: { select: { shopName: true } },
        payment: { select: { status: true, method: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const STATUS_OPTIONS = [
    "PENDING","ACCEPTED","REJECTED","AWAITING_PICKUP","PICKED_UP",
    "IN_PROGRESS","COMPLETED","OUT_FOR_DELIVERY","DELIVERED","CANCELLED","REFUNDED",
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Tactical Hub</span>
           </div>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter">Order Monitoring</h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Real-time surveillance of marketplace transactions and delivery sequences.</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-sm flex flex-col">
           <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">System Throughput</span>
           <span className="text-xl font-black text-on-surface">{total.toLocaleString()} Transitions</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-container-low/50 p-6 rounded-3xl border border-surface-container-high">
            <form className="relative group flex-1 max-w-md">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={16} className="text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
               </div>
               <input name="q" defaultValue={sp.q}
                  className="input pl-12 pr-6 h-12 w-full text-xs font-bold bg-surface-container-low border-surface-container-high focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" 
                  placeholder="Filter Node or Customer Identity..." />
               {sp.status && <input type="hidden" name="status" value={sp.status} />}
            </form>
            <div className="flex flex-wrap items-center gap-2">
               <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-30 mr-2">Sequence Filter:</span>
               <a href="/admin/orders"
                  className={`px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all border ${
                     !sp.status ? "bg-on-background text-white shadow-lg border-on-background" : "bg-white border-surface-container-high text-on-surface-variant hover:border-on-surface-variant/20"
                  }`}>
                  Global
               </a>
               <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.slice(0, 6).map((s) => (
                    <a key={s} href={`/admin/orders?status=${s}${sp.q ? `&q=${sp.q}` : ""}`}
                       className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all border ${
                          sp.status === s ? "bg-primary text-white shadow-brand border-primary" : "bg-white border-surface-container-high text-on-surface-variant hover:border-on-surface-variant/20"
                       }`}>
                       {s.replace("_", " ")}
                    </a>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Operation table */}
      <div className="card p-0 overflow-hidden border-surface-container-high shadow-2xl bg-surface-container-lowest rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-display">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high h-14">
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Stakeholder Identity</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Node Focus</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Yield Value</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Auth Status</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Protocol Layer</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/30 transition-all group border-b border-surface-container-high last:border-0">
                  <td className="px-8 py-6">
                    <p className="font-mono text-[0.7rem] font-black text-on-surface-variant tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{order.customer.name}</p>
                      <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-30">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <p className="text-[0.7rem] font-bold text-on-surface leading-snug">{order.partner.shopName}</p>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-base tracking-tighter text-on-surface">
                     {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-2 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border transition-all ${
                      order.payment?.status === "PAID"
                        ? "bg-green-500/10 text-green-600 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.1)]"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                      {order.payment?.status ?? "AWAITING"}
                    </span>
                  </td>
                  <td className="px-8 py-6 flex justify-center">
                     <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-8 py-6 text-right whitespace-nowrap">
                     <p className="text-[0.6rem] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{formatDate(order.createdAt)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Command Pagination */}
      {total > limit && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <p className="text-[0.65rem] font-black text-on-surface-variant/40 uppercase tracking-widest">
            Surveillance range: <span className="text-on-surface">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="text-on-surface">{total}</span> transitions
          </p>
          <div className="flex gap-4">
            {page > 1 && (
              <a href={`/admin/orders?page=${page - 1}${sp.status ? `&status=${sp.status}` : ""}`}
                className="btn btn-secondary h-12 px-8 font-black text-[0.65rem] uppercase tracking-[0.2em] active:scale-95 transition-all">
                <ChevronLeft size={16} /> Prev Sequence
              </a>
            )}
            {page * limit < total && (
              <a href={`/admin/orders?page=${page + 1}${sp.status ? `&status=${sp.status}` : ""}`}
                className="btn btn-primary h-12 px-8 font-black text-[0.65rem] uppercase tracking-[0.2em] active:scale-95 shadow-brand transition-all">
                Next Sequence <ChevronRight size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronLeft({ size, className }: { size: number, className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>; }
function ChevronRight({ size, className }: { size: number, className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>; }
