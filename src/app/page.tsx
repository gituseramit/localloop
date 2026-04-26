import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import {
  Printer, FileText, Scan, Clock, 
  MapPin, ShieldCheck, Star, Award, Users
} from "lucide-react";

// Icon mapping for dynamic categories
const ICON_MAP: Record<string, React.ReactNode> = {
  printouts: <Printer size={32} />,
  photocopy: <FileText size={32} />,
  scanning: <Scan size={32} />,
  lamination: <Award size={32} />,
  resume: <FileText size={32} />,
  "govt-forms": <Users size={32} />,
};

const DEFAULT_ICON = <FileText size={32} />;

const STEPS = [
  { step: "1", title: "Select Service", desc: "Find the specific service you need from our verified local network." },
  { step: "2", title: "Upload Documents", desc: "Safely upload your files via our secured, encrypted portal." },
  { step: "3", title: "Make Payment", desc: "Pay securely online utilizing your preferred checkout method." },
  { step: "4", title: "Get Delivered", desc: "Relax while our partner fulfills and delivers right to your door." },
];

export default async function HomePage() {
  // Real-time data fetching from Prisma
  const [categories, partners, stats] = await Promise.all([
    prisma.serviceCategory.findMany({ where: { isActive: true }, take: 6, orderBy: { sortOrder: 'asc' } }),
    prisma.partnerProfile.findMany({ take: 3, orderBy: { rating: 'desc' } }),
    prisma.order.count(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col text-[var(--on-background)]">
      <Navbar />

      {/* ── M3 Hero Section ────────────────────────────── */}
      <section className="bg-[var(--surface)] pt-16 pb-16 px-6 lg:px-8 border-b border-[var(--outline-variant)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--on-surface)] leading-tight">
              Professional services, <br />
              <span className="text-[var(--primary)]">delivered to your doorstep.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] leading-relaxed max-w-2xl">
              Access premium local services like document processing, resume making, and government assistance from {stats > 0 ? `the ${stats}+ orders we've handled` : 'the comfort of your home'}.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/services" className="btn btn-primary text-base px-8 py-4 shadow-elevated">
                Browse All Services
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 bg-[var(--surface-container)] rounded-lg text-[var(--on-surface)] font-medium">
                <Clock size={20} className="text-[var(--primary)]" />
                Fast Delivery Under 30 Mins
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end relative">
            <div className="w-full max-w-md aspect-square bg-[var(--surface-container-high)] rounded-3xl overflow-hidden flex items-center justify-center relative border border-[var(--outline-variant)]">
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--surface-container-lowest)]/50" />
               <FileText size={180} className="text-[var(--primary-container)] opacity-80 z-10" />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow">
        {/* ── Our Services Grid ────────────────────────── */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--on-surface)]">Our Services</h2>
            <p className="text-[var(--on-surface-variant)] mt-3 text-lg">Whatever you need, we handle it with care.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/services?category=${cat.slug}`} 
                   className="card p-8 group flex flex-col gap-6 hover:bg-[var(--surface-container-lowest)] cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary-container)]/10 text-[var(--primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {ICON_MAP[cat.slug] || DEFAULT_ICON}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--on-surface)] mb-2 group-hover:text-[var(--primary)] transition-colors">{cat.name}</h3>
                  <p className="text-[var(--on-surface-variant)] leading-relaxed">{cat.description || "High-quality document services at your location."}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Nearby Partners Block ────────────────────── */}
        <section className="py-16 bg-[var(--surface-container-low)] px-6">
           <div className="max-w-7xl mx-auto">
             <div className="mb-10">
               <h2 className="text-3xl font-bold text-[var(--on-surface)]">Featured Nearby Partners</h2>
               <p className="text-[var(--on-surface-variant)] mt-3 text-lg">Verified hubs delivering excellence near you.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
               {partners.map((partner, index) => (
                 <div key={index} className="card p-6 flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                     <h3 className="text-lg font-semibold text-[var(--on-surface)]">{partner.shopName}</h3>
                     <div className="flex items-center gap-1 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] px-2 py-1 rounded text-sm font-bold">
                       <Star size={14} fill="currentColor" /> {partner.rating || "New"}
                     </div>
                   </div>
                   <div className="flex items-center gap-4 text-sm text-[var(--on-surface-variant)] font-medium">
                     <span className="flex items-center gap-1"><MapPin size={16} /> {partner.city || "Local Hub"}</span>
                     <span className="flex items-center gap-1"><ShieldCheck size={16} /> {partner.totalOrders || 0} orders</span>
                   </div>
                 </div>
               ))}
               {partners.length === 0 && <p className="text-[var(--on-surface-variant)]">Discovering local hubs in your area...</p>}
             </div>
           </div>
        </section>

        {/* ── How it Works Pipeline ────────────────────── */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--on-surface)] mb-4">How it Works</h2>
            <p className="text-[var(--on-surface-variant)] text-lg">Simple 4-step process to get your work done without leaving home.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-[var(--outline-variant)] z-0" />
            
            {STEPS.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center text-3xl font-bold shadow-elevated border-4 border-[var(--background)]">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--on-surface)] mb-2">{step.title}</h3>
                  <p className="text-[var(--on-surface-variant)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

