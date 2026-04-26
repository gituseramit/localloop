"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ShoppingBag, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Printer, Zap, CreditCard, MapPin } from "lucide-react";

type Step = "role" | "form";
type Role = "CUSTOMER" | "PARTNER" | "DELIVERY_AGENT";

const ROLE_OPTIONS = [
  { value: "CUSTOMER" as Role, icon: "👤", label: "Customer", desc: "Order services from nearby partners" },
  { value: "PARTNER" as Role, icon: "🏪", label: "Service Partner", desc: "List your shop and accept orders" },
  { value: "DELIVERY_AGENT" as Role, icon: "🛵", label: "Delivery Agent", desc: "Pick up and deliver orders" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<Role>("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", shopName: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Signing you in...");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push(selectedRole === "PARTNER" ? "/partner/dashboard" : selectedRole === "DELIVERY_AGENT" ? "/delivery/dashboard" : "/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex selection:bg-primary/20 bg-surface-container-lowest">
      {/* Left panel – Strategic Onboarding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-on-background relative flex-col justify-center px-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, var(--secondary) 0%, transparent 60%)" }} />
        
        <div className="relative z-10 space-y-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 gradient-brand rounded-[1rem] flex items-center justify-center shadow-brand transition-transform group-hover:scale-110">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black text-white tracking-tight">LocalLoop</span>
               <span className="text-[0.7rem] font-bold text-secondary tracking-[0.2em] uppercase -mt-1 opacity-80">Join the Ecosystem</span>
            </div>
          </Link>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
              Empowering local <br />
              <span className="text-transparent bg-clip-text gradient-brand">capabilities globally.</span>
            </h2>
            <p className="text-xl text-on-surface-variant/60 font-medium leading-relaxed max-w-lg">
              Join the definitive marketplace for hyperlocal document and convenience services. Choose your path and start your journey.
            </p>
          </div>
          
          <div className="space-y-4 pt-8 border-t border-white/5 max-w-md">
            {[
              { label: "High-DPI Infrastructure", desc: "Access to verified high-precision document hubs", icon: <Printer size={16} /> },
              { label: "Smart Fulfillment", desc: "AI-driven order routing and secure processing", icon: <Zap size={16} /> },
              { label: "Frictionless Economy", desc: "Instant settlements and secure transaction protocols", icon: <CreditCard size={16} /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-on-surface-variant/50 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute -bottom-24 -left-24 w-96 h-96 gradient-brand opacity-10 blur-[120px] rounded-full" />
      </div>

      {/* Right panel – Registration Workflow */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="w-full max-w-[480px] space-y-8 py-8 animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 gradient-brand rounded-2xl flex items-center justify-center shadow-brand">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-on-surface tracking-tight">LocalLoop</span>
          </div>

          <div className="card p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity" />
            
            {step === "role" ? (
              <div className="animate-fade-in-up">
                <div className="mb-10">
                   <h1 className="text-3xl font-black text-on-surface tracking-tighter mb-2">Join the Fleet</h1>
                   <p className="text-sm text-on-surface-variant font-medium opacity-70">How will you be utilizing the LocalLoop infrastructure?</p>
                </div>
                <div className="space-y-4">
                  {ROLE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button"
                      onClick={() => setSelectedRole(opt.value)}
                      className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden group/opt ${
                        selectedRole === opt.value
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-4 ring-primary/5 scale-[1.02]"
                          : "border-outline-variant hover:border-outline hover:bg-surface-container-low"
                      }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover/opt:scale-110 ${
                         selectedRole === opt.value ? "bg-primary/10" : "bg-surface-container-high"
                      }`}>
                         {opt.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-black uppercase tracking-tighter ${selectedRole === opt.value ? "text-primary" : "text-on-surface"}`}>{opt.label}</p>
                        <p className="text-xs text-on-surface-variant font-medium opacity-70 mt-0.5">{opt.desc}</p>
                      </div>
                      {selectedRole === opt.value && (
                         <div className="absolute top-4 right-4">
                            <CheckCircle2 size={24} className="text-primary animate-scale-in" />
                         </div>
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep("form")} className="btn btn-primary w-full h-14 mt-10 text-base font-black shadow-brand group">
                  Continue Integration <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-sm text-center text-on-surface-variant font-medium mt-8 pt-8 border-t border-surface-container-high opacity-70">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-10">
                  <button onClick={() => setStep("role")} className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
                    <ArrowSmallLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-black text-on-surface tracking-tighter leading-tight">Identity Details</h1>
                    <p className="text-[0.7rem] font-black text-primary uppercase tracking-widest opacity-80">
                       Registering as {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label}
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                      <input className="input pl-12 h-14 font-medium" placeholder="Global Identifier Name" required
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                  </div>
                  {selectedRole === "PARTNER" && (
                    <div className="form-group animate-fade-in">
                      <label className="label">Hub / Facility Name</label>
                      <div className="relative">
                         <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                         <input className="input pl-12 h-14 font-medium" placeholder="e.g. Genesis Print Studio" required
                           value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="form-group">
                       <label className="label">Email Address</label>
                       <div className="relative">
                         <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                         <input className="input pl-12 h-14 font-medium text-sm" type="email" placeholder="corporate@mail.io" required
                           value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                       </div>
                     </div>
                     <div className="form-group">
                       <label className="label">Mobile Channel</label>
                       <div className="relative">
                         <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                         <input className="input pl-12 h-14 font-medium text-sm" type="tel" placeholder="+91 000-0000" maxLength={10}
                           value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                       </div>
                     </div>
                  </div>
                  <div className="form-group">
                    <label className="label">Credential Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                      <input className="input pl-12 pr-12 h-14 font-medium" type={showPassword ? "text" : "password"} placeholder="8+ characters recommended" required minLength={8}
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-[0.65rem] text-on-surface-variant leading-relaxed font-medium">
                    By confirming access, you agree to comply with our{" "}
                    <Link href="/terms" className="text-primary font-bold hover:underline">Service Protocols</Link> &amp;{" "}
                    <Link href="/privacy" className="text-primary font-bold hover:underline">Data Protection Policy</Link>.
                  </div>
                  <button type="submit" className="btn btn-primary w-full h-14 text-base font-black shadow-brand" disabled={loading}>
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <>Finalize Integration <ArrowRight size={20} className="ml-2" /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-6 text-[0.7rem] font-black text-on-surface-variant/30 uppercase tracking-[0.1em]">
             <span>LocalLoop Identity Protection 7.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowSmallLeft({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>; }
