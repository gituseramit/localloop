import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader, Avatar } from "@/components/ui";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Search, UserCheck, ShieldOff } from "lucide-react";
import UserActionButton from "./UserActionButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management — Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const sp = await searchParams;

  const where: Record<string, unknown> = {
    role: (sp.role as never) ?? "CUSTOMER",
    NOT: { id: session.user.id },
  };
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { email: { contains: sp.q, mode: "insensitive" } },
      { phone: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const ROLES = ["CUSTOMER", "PARTNER", "DELIVERY_AGENT"];

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Administrative Unit</span>
           </div>
           <h1 className="text-4xl font-black text-on-surface tracking-tighter">Identity Management</h1>
           <p className="text-sm text-on-surface-variant font-medium opacity-60">Regulate and verify all marketplace participants across the network.</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-sm flex flex-col">
           <span className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Active Scope</span>
           <span className="text-xl font-black text-on-surface">{users.length} Identities Found</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-container-low/50 p-4 rounded-3xl border border-surface-container-high px-6">
        {/* Role tabs switch */}
        <div className="flex gap-1 p-1 bg-surface-container-high/40 rounded-2xl w-fit">
          {ROLES.map((role) => (
            <a key={role} href={`/admin/users?role=${role}${sp.q ? `&q=${sp.q}` : ""}`}
              className={`px-6 py-2.5 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${
                (sp.role ?? "CUSTOMER") === role 
                   ? "bg-on-background text-white shadow-lg scale-105" 
                   : "text-on-surface-variant opacity-60 hover:opacity-100"
              }`}>
              {role === "DELIVERY_AGENT" ? "Agents" : role.charAt(0) + role.slice(1).toLowerCase() + "s"}
            </a>
          ))}
        </div>

        {/* Tactical Search */}
        <form className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          </div>
          <input name="q" defaultValue={sp.q}
            className="input pl-12 pr-6 h-12 w-full lg:w-80 text-xs font-bold bg-surface-container-low border-surface-container-high focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all" 
            placeholder="Search Identity Stream..." />
          <input type="hidden" name="role" value={sp.role ?? "CUSTOMER"} />
        </form>
      </div>

      {/* Identity Stream Table */}
      <div className="card p-0 overflow-hidden border-surface-container-high shadow-2xl bg-surface-container-lowest rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high h-14">
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Participant Identity</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Contact Stream</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Verification</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Sync Origin</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={user.name} size={40} src={user.avatarUrl} className="rounded-xl shadow-sm ring-2 ring-white" />
                      <div>
                        <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-0.5">UID: {user.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <p className="text-[0.7rem] font-bold text-on-surface/80">{user.email}</p>
                       <p className="text-[0.6rem] font-medium text-on-surface-variant opacity-40">{user.phone ?? "No Link"}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <span className={`px-2.5 py-1 rounded-md text-[0.6rem] font-black uppercase tracking-widest border ${
                          user.isVerified ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                       }`}>
                          {user.isVerified ? "Verified" : "Pending"}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <span className={`px-2.5 py-1 rounded-md text-[0.6rem] font-black uppercase tracking-widest border ${
                          user.isActive ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
                       }`}>
                          {user.isActive ? "Nominal" : "Suspended"}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-[0.7rem] font-black text-on-surface-variant opacity-30 uppercase tracking-widest">{formatRelativeTime(user.createdAt)}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <UserActionButton userId={user.id} isActive={user.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
