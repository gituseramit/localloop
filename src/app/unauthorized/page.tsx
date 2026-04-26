import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg,#f8fafc,#eff6ff)" }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <ShieldX size={36} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold font-display text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-neutral-500 mb-6">You don&apos;t have permission to view this page. Please sign in with an appropriate account.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn btn-primary">Sign In</Link>
          <Link href="/" className="btn btn-secondary">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
