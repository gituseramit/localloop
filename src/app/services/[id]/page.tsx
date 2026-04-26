import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Clock, ChevronLeft, ShieldCheck, Package } from "lucide-react";
import ServiceRequestForm from "./ServiceRequestForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const partner = await prisma.partnerProfile.findUnique({ where: { id }, select: { shopName: true } });
  return { title: partner?.shopName ?? "Service Partner" };
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await prisma.partnerProfile.findUnique({
    where: { id, isApproved: true },
    include: {
      serviceListings: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { price: "asc" },
      },
      user: { select: { name: true, avatarUrl: true } },
    },
  });

  if (!partner) notFound();

  // Group by category
  const grouped: Record<string, typeof partner.serviceListings> = {};
  for (const s of partner.serviceListings) {
    const cat = s.category.name;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }

  const hours = partner.operatingHours as Record<string, { open: string; close: string; closed: boolean }> | null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in pb-32">
      <Link href="/services" className="inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-primary mb-10 transition-all group">
         <div className="w-8 h-8 rounded-full border border-surface-container-high flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronLeft size={16} />
         </div>
         Back to Asset Grid
      </Link>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Intelligence Hub Information */}
        <div className="lg:col-span-8 space-y-12">
          {/* Partner Infrastructure Node */}
          <div className="card p-10 group overflow-hidden relative border-surface-container-high shadow-brand/5 shadow-2xl bg-surface-container-lowest">
            <div className="absolute top-0 right-0 w-64 h-64 gradient-brand opacity-5 blur-[100px] transition-opacity group-hover:opacity-10" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="w-32 h-32 rounded-[2.5rem] gradient-brand flex items-center justify-center text-5xl flex-shrink-0 shadow-brand animate-float">
                🏢
              </div>
              <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                       <span className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em] opacity-80 leading-none">Operational Service Node</span>
                       <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[0.55rem] font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                          <ShieldCheck size={10} /> Verified Infrastructure
                       </div>
                    </div>
                    <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-none mb-4">{partner.shopName}</h1>
                    <p className="text-on-surface-variant font-medium opacity-60 leading-relaxed max-w-xl">{partner.description ?? "Authorized LocalLoop service infrastructure providing high-fidelity document solutions."}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-1.5 p-4 rounded-3xl bg-surface-container-low border border-surface-container-high shadow-sm min-w-[120px]">
                    <div className="flex items-center gap-1.5">
                      <Star size={18} className="text-amber-500 fill-amber-500" />
                      <span className="text-2xl font-black text-on-surface leading-none">{partner.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{partner.totalOrders}+ Processes</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8 pt-8 border-t border-surface-container-high">
                  <div className="flex items-center gap-2 group/item">
                     <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                        <MapPin size={14} />
                     </div>
                     <span className="text-xs font-black text-on-surface uppercase tracking-widest">{partner.city ?? "Delhi"} – {partner.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2 group/item">
                     <div className="w-8 h-8 rounded-lg bg-green-500/5 flex items-center justify-center text-green-600 group-hover/item:bg-green-600 group-hover/item:text-white transition-all">
                        <Clock size={14} />
                     </div>
                     <span className="text-xs font-black text-on-surface uppercase tracking-widest">Active Transmission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Specific Services Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-7 bg-primary rounded-full shadow-brand" />
               <h2 className="text-2xl font-black text-on-surface tracking-tighter">Domain Allocations</h2>
            </div>
            
            {Object.entries(grouped).map(([category, services]) => (
              <div key={category} className="card p-0 overflow-hidden border-surface-container-high shadow-xl bg-surface-container-lowest animate-fade-in group/cat">
                <div className="px-8 py-5 border-b border-surface-container-high bg-surface-container-low/50 flex items-center justify-between group-hover/cat:bg-surface-container-low transition-colors">
                  <h3 className="text-[0.7rem] font-black text-on-surface uppercase tracking-[0.2em]">{category} Status</h3>
                  <div className="px-3 py-1 rounded-lg bg-on-background/5 text-[0.55rem] font-black text-on-surface uppercase tracking-widest leading-none">
                     {services.length} Assets
                  </div>
                </div>
                <div className="divide-y divide-surface-container-high">
                  {services.map((service) => (
                    <div key={service.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 hover:bg-surface-container-low/30 transition-all group/item relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-full gradient-brand opacity-0 group-hover/item:opacity-[0.02] transition-opacity pointer-events-none" />
                      <div className="flex-1 min-w-0 pr-8">
                         <div className="flex items-center gap-3 mb-2">
                           <h4 className="text-xl font-black text-on-surface leading-tight tracking-tight group-hover/item:text-primary transition-colors">{service.name}</h4>
                           <Package size={14} className="text-primary opacity-0 group-hover/item:opacity-40 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                         </div>
                        {service.description && (
                          <p className="text-sm text-on-surface-variant font-medium leading-relaxed opacity-60 line-clamp-2 mb-4">{service.description}</p>
                        )}
                        {service.estimatedTime && (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container-high inline-flex">
                             <Clock size={12} className="text-on-surface-variant opacity-40" />
                             <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60">
                                Cycle Time: {service.estimatedTime}
                             </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-6 flex-shrink-0 border-t md:border-t-0 md:border-l border-surface-container-high pt-6 md:pt-0 md:pl-8 mt-auto w-full md:w-auto justify-between md:justify-end">
                        <div className="flex flex-col items-end">
                           <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-30">Cost / Unit</span>
                           <span className="text-2xl font-black text-on-surface tracking-tighter">₹{service.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Temporal Infrastructure Status */}
          {hours && (
            <div className="card p-10 border-surface-container-high bg-on-background text-white shadow-brand">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                    <Clock size={20} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black tracking-tighter">Uptime Sequences</h2>
                    <p className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest">Global operational hours</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(hours).map(([day, h]) => (
                  <div key={day} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <span className="capitalize text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{day}</span>
                    <span className={`text-sm font-black tracking-tight ${h.closed ? "text-red-500" : "text-white"}`}>
                      {h.closed ? "Operational Offline" : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Fulfillment Terminal */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32 space-y-8">
            <div className="card p-0 overflow-hidden border-primary/20 shadow-brand overflow-visible">
               <div className="absolute -top-4 left-6 px-4 py-1.5 rounded-full bg-primary text-white text-[0.6rem] font-black uppercase tracking-[0.2em] shadow-lg z-10">
                  Secure Request Terminal
               </div>
               <div className="p-8 pb-4 bg-surface-container-low border-b border-surface-container-high">
                  <h3 className="text-lg font-black text-on-surface tracking-tight">Initiate Service Flow</h3>
                  <p className="text-[0.65rem] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">Select assets to continue</p>
               </div>
               <div className="p-8">
                  <ServiceRequestForm partner={partner} services={partner.serviceListings} />
               </div>
            </div>
            
            <div className="card p-8 border-surface-container-high shadow-xl bg-surface-container-low/50 border-dashed">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <ShieldCheck size={20} />
                  </div>
                  <p className="text-xs font-black text-on-surface tracking-tight">LocalLoop Secure Infrastructure Hub</p>
               </div>
               <p className="text-[0.65rem] font-medium text-on-surface-variant leading-relaxed opacity-60">All document transmissions are processed through our hyperlocal verification mesh for maximum asset security and sequence integrity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
