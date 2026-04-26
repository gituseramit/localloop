import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, Award } from "lucide-react";

export default function Footer() {
  const services = [
    "Printouts", "Photocopy / Xerox", "Scanning", "Lamination",
    "Passport Photo", "Document Typing", "Resume Making", "Form Filling",
  ];

  return (
    <footer className="relative bg-[var(--on-surface)] pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Identity */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <ShoppingBag size={24} className="text-[var(--on-primary)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white">LocalLoop</span>
                <span className="text-[0.6rem] font-bold text-[var(--primary-container)] uppercase tracking-[0.2em] -mt-1">Document Services</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              India&apos;s definitive marketplace for hyperlocal document and convenience services. Powered by verified local hubs.
            </p>
          </div>

          {/* Service Matrix */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest opacity-60">Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link href={`/services?q=${encodeURIComponent(s)}`}
                    className="text-white/60 text-sm hover:text-white transition-all font-medium flex items-center gap-2 group">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest opacity-60">Platform</h4>
            <ul className="space-y-3">
              {[
                { href: "/partner/register", label: "Become a Partner" },
                { href: "/delivery/register", label: "Logistic Agent" },
                { href: "/how-it-works", label: "How it Works" },
                { href: "/pricing", label: "Pricing" },
                { href: "/support", label: "Support" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 text-sm hover:text-white transition-all font-medium flex items-center gap-2 group">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Ops */}
          <div>
            <h4 className="font-bold text-white mb-6 text-xs uppercase tracking-widest opacity-60">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:ops@localloop.in" className="flex items-center gap-3 text-white/70 text-sm hover:text-white transition-all font-medium">
                <Mail size={18} /> ops@localloop.in
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm font-medium">
                <MapPin size={18} className="mt-0.5" />
                <div>
                  <p className="leading-tight">NCR Command Center</p>
                  <p className="opacity-50 mt-1">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[0.7rem] text-white/40 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} LocalLoop Technologies.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
