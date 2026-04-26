"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, Store, BarChart2,
  LogOut, ShoppingBag, Settings, Menu, X, ChevronRight
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/partner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/partner/orders", icon: Package, label: "Orders" },
  { href: "/partner/services", icon: Store, label: "My Services" },
  { href: "/partner/earnings", icon: BarChart2, label: "Earnings" },
  { href: "/partner/profile", icon: Settings, label: "Shop Profile" },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden selection:bg-primary/20">
      {/* Premium Sidebar Infrastructure for Partners */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-on-background flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Identity Section */}
        <div className="px-8 py-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-brand transition-transform group-hover:scale-110">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-black text-white tracking-tight leading-none">LocalLoop</span>
               <span className="text-[0.6rem] font-bold text-secondary tracking-[0.2em] uppercase mt-1 opacity-80">Partner Hub</span>
            </div>
          </Link>
          <button className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white" onClick={() => setSidebarOpen(false)}>
             <X size={18} />
          </button>
        </div>

        {/* Dynamic Partner Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <p className="text-[0.65rem] font-black text-white/20 uppercase tracking-[0.2em] px-4 mb-4">Operations Center</p>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 h-12 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden ${
                      active 
                        ? "bg-secondary text-white shadow-brand" 
                        : "text-on-surface-variant/40 hover:bg-white/5 hover:text-white"
                    }`}>
                    {active && (
                       <div className="absolute left-0 w-1 h-4 bg-white rounded-full opacity-50" />
                    )}
                    <item.icon size={18} className={`transition-transform group-hover:scale-110 ${active ? "opacity-100" : "opacity-40 group-hover:opacity-80"}`} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight size={14} className="opacity-40" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Operational Exit */}
        <div className="px-4 py-8 border-t border-white/5 bg-on-background/50 backdrop-blur-xl">
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3.5 px-4 h-12 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all w-full group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Exit Console</span>
          </button>
          <div className="mt-6 px-4">
             <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black text-[0.6rem]">P</div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-[0.65rem] font-bold text-white truncate">Service Hub Alpha</p>
                   <p className="text-[0.55rem] font-medium text-white/30 truncate">Verified Partner</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Global Backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-on-background/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Command Bar */}
        <header className="lg:hidden flex items-center justify-between px-6 h-20 bg-on-background text-white shadow-2xl relative z-30">
          <button onClick={() => setSidebarOpen(true)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 active:scale-95 transition-all">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-brand">
               <ShoppingBag size={16} className="text-white" />
             </div>
             <span className="font-black text-white text-base tracking-tight">Partner Portal</span>
          </div>
          <div className="w-12" />
        </header>

        {/* Fluid Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
             {children}
          </div>
        </main>
        
        <div className="absolute -bottom-48 -right-48 w-96 h-96 gradient-brand opacity-5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
