import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User, Mail, Shield, Building } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-[var(--on-background)]">
            Platform Identity
          </h1>
          <p className="text-[var(--on-surface-variant)] text-lg">
            Manage your spatial network presence.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)] shadow-sm space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <User className="w-12 h-12 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--on-surface)]">{session.user.name || "Network Agent"}</h2>
              <p className="text-[var(--on-surface-variant)] font-mono text-sm mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {session.user.email}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-[var(--outline-variant)]">
            <div className="p-6 rounded-2xl bg-[var(--surface-container)] flex items-start gap-4">
              <Shield className="w-6 h-6 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-bold text-[var(--on-surface)]">Clearance Level</h4>
                <p className="text-[var(--on-surface-variant)] text-sm mt-1">{session.user.role}</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--surface-container)] flex items-start gap-4">
              <Building className="w-6 h-6 text-amber-500 mt-1" />
              <div>
                <h4 className="font-bold text-[var(--on-surface)]">Entity Status</h4>
                <p className="text-[var(--on-surface-variant)] text-sm mt-1">Verified Node</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <button className="btn btn-secondary font-bold w-full md:w-auto">Request Entity Matrix Update</button>
          </div>
        </div>

      </div>
    </div>
  );
}
