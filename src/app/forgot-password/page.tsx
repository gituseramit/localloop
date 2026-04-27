import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="max-w-md w-full space-y-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Protocol Identity
        </Link>
        
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Recover Key</h1>
          <p className="text-on-surface-variant">Enter your registered matrix coordinate (email) to receive a secure recovery protocol.</p>
        </div>

        <form className="space-y-6 mt-8" onClick={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Coordinate Email</label>
            <input 
              type="email" 
              placeholder="agent@localloop.in"
              className="w-full bg-surface-container h-14 px-6 rounded-2xl border-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          
          <button className="btn btn-primary w-full h-14 font-black shadow-brand active:scale-[0.98]">
            Transmit Recovery Link
          </button>
          
          <p className="text-xs text-center text-on-surface-variant/60 mt-4">
            If your node is fully suspended, this protocol will fail.
          </p>
        </form>
      </div>
    </div>
  );
}
