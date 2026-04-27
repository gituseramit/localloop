import { prisma } from "@/lib/db";
import Link from "next/link";
import { Search, Filter, Star, MapPin, Clock, ChevronRight, Zap, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Services Near You",
  description: "Browse verified local service partners for high-fidelity document fulfillment.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const sp = await searchParams;

  const [categories, partners] = await Promise.all([
    prisma.serviceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.partnerProfile.findMany({
      where: {
        isApproved: true,
        isSuspended: false,
        ...(sp.category && {
          serviceListings: { some: { category: { slug: sp.category }, isActive: true } },
        }),
        ...(sp.q && {
          OR: [
            { shopName: { contains: sp.q, mode: "insensitive" } },
            { serviceListings: { some: { name: { contains: sp.q, mode: "insensitive" } } } },
          ],
        }),
      },
      include: {
        serviceListings: {
          where: { isActive: true },
          include: { category: true },
          take: 6,
        },
        user: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { rating: "desc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">Document Fulfillment</span>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter leading-tight">
            Verified Service Hubs<br />in your proximity.
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/services#map" className="btn btn-secondary py-3 px-6 gap-2 font-bold shadow-sm inline-flex">
            <Filter size={18} className="text-primary" /> Map View
          </Link>
        </div>
      </div>

      {/* Global Search Interface */}
      <div className="flex gap-4 mb-10 group">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 transition-opacity group-focus-within:opacity-100" />
          <form method="GET">
            <input name="q" defaultValue={sp.q}
              className="input pl-14 h-16 text-lg font-medium shadow-lg border-surface-container-high transition-all focus:border-primary/30"
              placeholder="Search printouts, document typing, scan hubs..." />
          </form>
        </div>
        <button className="btn btn-primary h-16 px-8 gap-3 font-black shadow-brand scale-100 hover:scale-[1.02] active:scale-95 transition-all">
          <Zap size={20} /> Execute Search
        </button>
      </div>

      {/* Domain Pillars (Category pills) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-12 scrollbar-hide">
        <Link href="/services"
          className={`flex-shrink-0 px-6 h-12 flex items-center rounded-2xl text-[0.8rem] font-black uppercase tracking-[0.1em] transition-all border ${!sp.category ? "border-primary bg-primary text-white shadow-brand" : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-outline"}`}>
          All Hubs
        </Link>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/services?category=${cat.slug}`}
            className={`flex-shrink-0 px-6 h-12 flex items-center rounded-2xl text-[0.8rem] font-black uppercase tracking-[0.1em] transition-all border gap-2 ${sp.category === cat.slug ? "border-primary bg-primary text-white shadow-brand" : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-outline"}`}>
            {cat.icon && <span className="text-lg grayscale-0 group-hover:scale-110 transition-transform">{cat.icon}</span>} {cat.name}
          </Link>
        ))}
      </div>

      {/* Hub Marketplace Grid */}
      {partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 rounded-[3rem] bg-surface-container-low border border-dashed border-outline-variant animate-fade-in">
           <div className="w-24 h-24 rounded-3xl bg-surface-container-high flex items-center justify-center text-5xl mb-8 shadow-inner">🔍</div>
           <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">No Verified Hubs Encountered</h3>
           <p className="text-on-surface-variant font-medium opacity-60 text-center max-w-sm">No service partners match your search criteria. Try a different domain or clear filters.</p>
           <Link href="/services" className="btn btn-secondary mt-8 font-bold">Clear All System Filters</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <Link key={partner.id} href={`/services/${partner.id}`}
              className="card p-0 overflow-hidden animate-fade-in-up group flex flex-col h-full"
              style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Strategic Cover */}
              <div className="h-44 relative bg-on-background overflow-hidden border-b border-surface-container-high">
                <div className="absolute inset-0 opacity-40 z-0"
                   style={{ background: `linear-gradient(135deg, hsl(${(i * 40 + 210) % 360},80%,40%) 0%, hsl(${(i * 40 + 280) % 360},80%,30%) 100%)` }} />
                
                {/* Patterns */}
                <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                
                <div className="absolute top-4 right-4 z-10">
                  {partner.totalOrders > 50 && (
                    <span className="badge gradient-brand text-white shadow-brand border-none text-[0.65rem] font-black uppercase tracking-widest px-3">
                      High Efficiency
                    </span>
                  )}
                </div>
                
                <div className="absolute bottom-[-24px] left-6 z-10">
                   <div className="w-20 h-20 bg-surface-container-lowest rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-surface-container-lowest transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <Building2 size={32} className="text-primary opacity-80" />
                   </div>
                </div>
              </div>

              {/* Functional Content */}
              <div className="p-8 pt-12 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-2xl font-black text-on-surface tracking-tighter leading-none group-hover:text-primary transition-colors">
                    {partner.shopName}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/10 shrink-0">
                    <Star size={14} className="fill-current" />
                    <span className="text-[0.8rem] font-bold">{partner.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-bold text-on-surface-variant uppercase tracking-wider opacity-60 mb-6 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" /> {partner.city ?? "Delhi NCR"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-secondary" /> Rapid Status
                  </span>
                </div>
                
                {/* Expertise Nodes (Service chips) */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {partner.serviceListings.slice(0, 3).map((s) => (
                    <span key={s.id} className="text-[0.65rem] font-black px-3 h-7 flex items-center rounded-full bg-surface-container-high text-on-surface uppercase tracking-tight">
                      {s.name}
                    </span>
                  ))}
                  {partner.serviceListings.length > 3 && (
                    <span className="text-[0.65rem] font-black px-3 h-7 flex items-center rounded-full bg-primary/10 text-primary uppercase tracking-tight">
                      +{partner.serviceListings.length - 3} Expertise
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-surface-container-high flex items-center justify-between">
                  <div className="leading-tight">
                    <p className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-1">Base Price</p>
                    <p className="text-xl font-black text-on-surface leading-none">₹{partner.serviceListings.length > 0 ? Math.min(...partner.serviceListings.map(s => s.price)) : "N/A"}</p>
                  </div>
                  <div className="btn btn-primary btn-sm py-2 px-5 shadow-sm group-hover:shadow-brand transition-all">
                    Initiate Hub <ChevronRight size={14} className="ml-1" />
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
