import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader, Avatar, EmptyState } from "@/components/ui";
import { CheckCircle2, XCircle, Clock, Store, Phone, Mail } from "lucide-react";
import PartnerApprovalActions from "./PartnerApprovalActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partner Management" };

export default async function AdminPartnersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [pending, approved] = await Promise.all([
    prisma.partnerProfile.findMany({
      where: { isApproved: false, isSuspended: false },
      include: { user: { select: { name: true, email: true, phone: true, createdAt: true } } },
      orderBy: { user: { createdAt: "desc" } },
    }),
    prisma.partnerProfile.findMany({
      where: { isApproved: true },
      include: { user: { select: { name: true, email: true, phone: true } } },
      orderBy: { totalOrders: "desc" },
      take: 30,
    }),
  ]);

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">System Core</span>
           </div>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter">Network Management</h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60 max-w-xl">Oversee and regulate service partner nodes across the marketplace ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-sm flex flex-col">
              <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Total Nodes</span>
              <span className="text-xl font-black text-on-surface">{approved.length + pending.length}</span>
           </div>
           <div className="px-6 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-sm flex flex-col">
              <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Operational</span>
              <span className="text-xl font-black text-primary">{approved.length}</span>
           </div>
        </div>
      </div>

      {/* High-Priority Approval Queue */}
      {pending.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-[0.7rem] font-black text-on-surface uppercase tracking-[0.3em]">Priority Approval Queue</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[0.6rem] font-black uppercase tracking-widest border border-amber-500/20">
               {pending.length} Actions Required
            </span>
          </div>
          <div className="grid gap-6">
            {pending.map((partner) => (
              <div key={partner.id} className="card p-8 group relative overflow-hidden border-amber-500/20 bg-amber-500/[0.02] shadow-xl shadow-amber-500/5 hover:border-amber-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
                <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                  <div className="relative">
                     <Avatar name={partner.user.name} size={64} className="rounded-2xl shadow-lg ring-4 ring-white" />
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-sm scale-110">
                        <Clock size={12} />
                     </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-on-surface tracking-tighter leading-none group-hover:text-amber-600 transition-colors">{partner.shopName}</h3>
                          <span className="px-2 py-0.5 rounded-md bg-on-background/5 text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest">Awaiting Verification</span>
                       </div>
                       <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest opacity-40">{partner.user.name} · Operator</p>
                    </div>

                    {partner.description && (
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed bg-white/50 p-4 rounded-xl border border-on-background/5 italic">
                        &ldquo;{partner.description}&rdquo;
                      </p>
                    )}

                    <div className="flex flex-wrap gap-6 pt-2">
                      <div className="space-y-1">
                         <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Contact Stream</p>
                         <div className="flex items-center gap-4 text-[0.7rem] font-bold text-on-surface/80">
                           {partner.user.email && <span className="flex items-center gap-1.5"><Mail size={12} className="opacity-40" />{partner.user.email}</span>}
                           {partner.user.phone && <span className="flex items-center gap-1.5"><Phone size={12} className="opacity-40" />{partner.user.phone}</span>}
                         </div>
                      </div>
                      {partner.city && (
                        <div className="space-y-1">
                           <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Geospatial Vector</p>
                           <span className="text-[0.7rem] font-bold text-on-surface/80 flex items-center gap-1.5"><Store size={12} className="opacity-40" />{partner.city} · {partner.pincode}</span>
                        </div>
                      )}
                      {partner.gstNumber && (
                        <div className="space-y-1">
                           <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Legal Taxonomy</p>
                           <span className="text-[0.7rem] font-bold text-on-surface/80 font-mono tracking-tighter uppercase">GST: {partner.gstNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex self-center">
                    <PartnerApprovalActions partnerId={partner.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fleet Inventory Table */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-[0.7rem] font-black text-on-surface uppercase tracking-[0.3em]">Operational Service Partners</h2>
        </div>
        {approved.length === 0 ? (
          <div className="card h-64 flex flex-col items-center justify-center text-center bg-surface-container-low/20 border-dashed border-2 border-surface-container-high rounded-3xl">
            <Store size={48} className="text-on-surface-variant opacity-20 mb-4" />
            <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest opacity-40">No active nodes registered</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden border-surface-container-high shadow-2xl bg-surface-container-lowest rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-surface-container-high h-14">
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Node / Operator</th>
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Deployment</th>
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Throughput</th>
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Score</th>
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Yield Split</th>
                    <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {approved.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/30 transition-all group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <Avatar name={p.user.name} size={40} className="rounded-xl shadow-sm ring-2 ring-white" />
                            <div>
                               <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{p.shopName}</p>
                               <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-0.5">{p.user.name}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[0.7rem] font-bold text-on-surface/80">{p.city ?? "Remote"}</span>
                      </td>
                      <td className="px-8 py-6 text-center font-black text-lg tracking-tighter text-on-surface">{p.totalOrders}</td>
                      <td className="px-8 py-6 text-center">
                         <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[0.65rem] font-black tracking-widest flex items-center justify-center gap-1 w-20 mx-auto border border-amber-500/20">
                            {p.rating.toFixed(1)} <Star size={10} fill="currentColor" />
                         </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="text-[0.7rem] font-black text-on-surface/60">{p.commissionRate}%</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <PartnerApprovalActions partnerId={p.id} isApproved suspended={p.isSuspended} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Star({ size, className, fill }: { size: number, className?: string, fill?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ?? "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
