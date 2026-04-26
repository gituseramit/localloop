"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingBag, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, Zap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email/phone or password");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  const DEMO = [
    { label: "Customer", email: "amit.kumar@gmail.com", password: "Customer@123" },
    { label: "Partner", email: "raju.prints@localloop.in", password: "Partner@123" },
    { label: "Admin", email: "admin@localloop.in", password: "Admin@123" },
    { label: "Agent", email: "rajesh.delivery@localloop.in", password: "Agent@123" },
  ];

  return (
    <div className="min-h-screen flex selection:bg-primary/20 bg-surface-container-lowest">
      {/* Left panel – Strategic Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-on-background relative flex-col justify-center px-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)" }} />
        
        <div className="relative z-10 space-y-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 gradient-brand rounded-[1rem] flex items-center justify-center shadow-brand transition-transform group-hover:scale-110">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black text-white tracking-tight">LocalLoop</span>
               <span className="text-[0.7rem] font-bold text-primary tracking-[0.2em] uppercase -mt-1 opacity-80">Document Services</span>
            </div>
          </Link>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
              The professional edge for <br />
              <span className="text-transparent bg-clip-text gradient-brand">your document workflow.</span>
            </h2>
            <p className="text-xl text-on-surface-variant/60 font-medium leading-relaxed max-w-lg">
              Join the high-fidelity marketplace where speed meets precision. Verified partners, secure cloud processing, and express delivery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-8 border-t border-white/5 max-w-md">
            {[
              { label: "Verified Service Hubs", desc: "Rigorous 5-step KYC & facility audit", icon: <Shield size={16} /> },
              { label: "Secured Cloud Storage", desc: "Enterprise-grade encryption for all files", icon: <Lock size={16} /> },
              { label: "Hyper-Express Delivery", desc: "Average fulfillment in under 22 minutes", icon: <Zap size={16} /> }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary-container shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-on-surface-variant/50 font-medium mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute -bottom-24 -left-24 w-96 h-96 gradient-brand opacity-10 blur-[120px] rounded-full" />
      </div>

      {/* Right panel – Secure Authentication */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Decorative elements for mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-48 bg-on-background -z-10" />
        
        <div className="w-full max-w-[440px] space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-12">
             <Link href="/" className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center shadow-brand">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <span className="text-2xl font-black text-white lg:text-on-surface tracking-tight">LocalLoop</span>
             </Link>
          </div>

          <div className="card p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity" />
            
            <div className="space-y-2 mb-10">
              <h1 className="text-3xl font-black text-on-surface tracking-tighter">Professional Access</h1>
              <p className="text-sm text-on-surface-variant font-medium opacity-70 leading-relaxed">
                Enter your credentials to manage your document ecosystem.
              </p>
            </div>

            {/* Social Authentication */}
            <button onClick={handleGoogle} disabled={loading}
              className="btn btn-secondary w-full py-3.5 mb-6 gap-3 font-bold border-surface-container-high hover:bg-surface-container-low shadow-sm">
              <svg width="20" height="20" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" /></svg>
              Sign in with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-surface-container-high" />
              <span className="text-[0.65rem] text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-50">Secure Email Access</span>
              <div className="flex-1 h-[1px] bg-surface-container-high" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="label">Identity Identifier</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                  <input className="input pl-12 h-14 font-medium" type="text" placeholder="corporate@identity.ai" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="label mb-0">System Password</label>
                  <Link href="/forgot-password" className="text-[0.7rem] font-bold text-primary hover:underline uppercase tracking-wider">Recover Key</Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                  <input className="input pl-12 pr-12 h-14 font-medium" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full h-14 text-base shadow-brand scale-100 hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                {loading ? <Loader2 size={24} className="animate-spin" /> : <>Authenticate Profile <ArrowRight size={20} className="ml-2" /></>}
              </button>
            </form>

            <p className="text-sm text-center text-on-surface-variant font-medium mt-8 border-t border-surface-container-high pt-8 opacity-70">
              New to the document ecosystem?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">Create a free account</Link>
            </p>

            {/* Managed Demo Tunnels */}
            <details className="mt-8 group/demo">
              <summary className="text-[0.65rem] font-black text-on-surface-variant/40 cursor-pointer hover:text-primary text-center uppercase tracking-[0.2em] transition-colors list-none">
                System Access Tunnels (Demo)
              </summary>
              <div className="mt-5 grid grid-cols-2 gap-3 animate-fade-in">
                {DEMO.map((d) => (
                  <button key={d.label} type="button"
                    onClick={() => { setForm({ email: d.email, password: d.password }); toast.success(`${d.label} sequence loaded`); }}
                    className="text-[0.7rem] p-3 rounded-xl border border-surface-container-high hover:border-primary/30 hover:bg-primary/5 transition-all text-on-surface-variant text-left group/btn">
                    <span className="font-black text-on-surface group-hover/btn:text-primary block mb-0.5 uppercase tracking-tighter">{d.label} Mode</span>
                    <span className="opacity-50 font-medium truncate block">{d.email}</span>
                  </button>
                ))}
              </div>
            </details>
          </div>
          
          <div className="flex justify-center gap-6 text-[0.65rem] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
             <Link href="/privacy" className="hover:text-on-surface transition-colors">Privacy Infrastructure</Link>
             <Link href="/terms" className="hover:text-on-surface transition-colors">Service Protocols</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shield({ size, className }: { size: number, className?: string }) { return <ShieldCheck size={size} className={className} />; }
