"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  ShoppingBag, Menu, X, MapPin, Bell, User, LogOut,
  ChevronDown, Package, LayoutDashboard, Settings
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleLinks = {
    ADMIN: [{ href: "/admin", label: "Admin Panel", icon: LayoutDashboard }],
    PARTNER: [{ href: "/partner/dashboard", label: "Partner Dashboard", icon: LayoutDashboard }],
    DELIVERY_AGENT: [{ href: "/delivery/dashboard", label: "My Tasks", icon: Package }],
    CUSTOMER: [{ href: "/orders", label: "My Orders", icon: Package }],
  };

  const links = session?.user?.role ? roleLinks[session.user.role as keyof typeof roleLinks] ?? [] : [];

  return (
    <header className="relative z-50 w-full bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]">
      <nav className="px-6 sm:px-10 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <ShoppingBag size={20} className="text-[var(--on-primary)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[var(--on-surface)]">
              LocalLoop
            </span>
            <span className="text-[0.65rem] font-bold text-[var(--primary)] tracking-[0.1em] uppercase -mt-1 opacity-80">
              Document Services
            </span>
          </div>
        </Link>

        {/* Location pill */}
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-sm text-[var(--on-surface-variant)] hover:border-[var(--primary)]/30 transition-all">
          <MapPin size={15} className="text-[var(--primary)]" />
          <span className="max-w-[140px] truncate font-semibold">Delhi, India</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1.5 ml-4">
          <Link href="/services" className="px-4 py-2 text-sm font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all">
            Services
          </Link>
          <Link href="/how-it-works" className="px-4 py-2 text-sm font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all">
            How it Works
          </Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="px-4 py-2 text-sm font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all flex items-center gap-2">
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 ml-auto">
          {session ? (
            <>
              <button className="relative p-2.5 rounded-xl hover:bg-[var(--surface-container-low)] transition-all text-[var(--on-surface-variant)] border border-transparent hover:border-[var(--outline-variant)]">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--error)] border-2 border-white rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl hover:bg-[var(--surface-container-low)] transition-all border border-transparent hover:border-[var(--outline-variant)]"
                >
                  <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center text-[var(--on-primary)] text-sm font-bold">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-[0.75rem] font-bold text-[var(--on-surface-variant)] uppercase tracking-tighter opacity-70">Welcome</span>
                    <span className="text-sm font-bold text-[var(--on-surface)]">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-[var(--on-surface-variant)] opacity-50" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-60 card overflow-hidden shadow-xl z-[100]" style={{ padding: "0.5rem" }}>
                    <div className="px-3 py-3 border-b border-[var(--outline-variant)] mb-1.5">
                      <p className="text-sm font-bold text-[var(--on-surface)] leading-tight">{session.user.name}</p>
                      <p className="text-[0.7rem] font-medium text-[var(--on-surface-variant)] break-all opacity-80">{session.user.email}</p>
                    </div>
                    {links.map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all">
                        <l.icon size={18} /> {l.label}
                      </Link>
                    ))}
                    <Link href="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all">
                      <Settings size={18} /> Profile Settings
                    </Link>
                    <hr className="my-2 border-[var(--outline-variant)]" />
                    <button onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--error)] hover:bg-[var(--error)]/5 rounded-xl transition-all">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-bold text-[var(--on-surface)] hover:bg-[var(--surface-container-low)] rounded-xl transition-all">Log in</Link>
              <Link href="/signup" className="btn btn-primary btn-sm px-6">Sign up</Link>
            </div>
          )}
          <button className="md:hidden p-2.5 rounded-xl hover:bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4 flex flex-col gap-2 shadow-xl">
          <Link href="/services" className="px-4 py-3 text-sm font-bold bg-[var(--surface-container-low)] text-[var(--primary)] rounded-xl" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/how-it-works" className="px-4 py-3 text-sm font-bold text-[var(--on-surface-variant)]" onClick={() => setMenuOpen(false)}>How it Works</Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="px-4 py-3 text-sm font-bold text-[var(--on-surface-variant)] flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <l.icon size={18} /> {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
