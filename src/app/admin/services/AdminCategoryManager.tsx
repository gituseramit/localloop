"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "", icon: "", description: "" });

  async function toggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    });
  }

  async function createCategory() {
    if (!newCat.name || !newCat.slug) { toast.error("Identity and URI are required"); return; }
    startTransition(async () => {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        toast.success("Domain protocol initialized");
        setShowAdd(false);
        setNewCat({ name: "", slug: "", icon: "", description: "" });
        router.refresh();
      } else {
        toast.error("Failed to initialize domain");
      }
    });
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low p-8 rounded-3xl border border-surface-container-high shadow-sm">
        <div className="space-y-1">
           <h2 className="text-2xl font-black text-on-surface tracking-tighter">Taxonomy Architecture</h2>
           <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest opacity-40">Manage global service classification protocols</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={`btn font-black text-xs uppercase tracking-[0.2em] px-8 h-12 shadow-brand group transition-all ${
           showAdd ? "btn-secondary" : "btn-primary"
        }`}>
          {showAdd ? <><X size={16} /> Close Terminal</> : <><Plus size={16} className="group-hover:rotate-90 transition-transform" /> Initialize Protocol</>}
        </button>
      </div>

      {showAdd && (
        <div className="card p-10 mb-10 border-primary/20 shadow-brand animate-fade-in bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-5 blur-[60px]" />
          <div className="relative z-10">
            <h3 className="text-[0.7rem] font-black text-primary uppercase tracking-[0.3em] mb-8">Domain Initialization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Domain Identity *</label>
                <input className="input h-12 text-xs font-black uppercase tracking-wider" placeholder="e.g. CORE SERVICES" value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Universal URI *</label>
                <input className="input h-12 text-xs font-mono font-bold" placeholder="e.g. core-services" value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Symbolic Identifier (Emoji)</label>
                <input className="input h-12 text-center text-xl" placeholder="🖨️" value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Tactical Scope</label>
                <input className="input h-12 text-xs font-medium" placeholder="Global operational scope description..." value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-surface-container-high">
              <button onClick={createCategory} disabled={isPending} className="btn btn-primary h-12 px-10 font-black text-xs uppercase tracking-[0.2em] shadow-brand active:scale-95">
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Commit Protocol
              </button>
              <button onClick={() => setShowAdd(false)} className="btn btn-secondary h-12 px-10 font-black text-xs uppercase tracking-[0.2em] active:scale-95">Discard</button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden border-surface-container-high shadow-2xl bg-surface-container-lowest rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high h-14">
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] w-24">Symbol</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Domain Identity</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Universal URI</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Tactical Scope</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-low/30 transition-all group">
                  <td className="px-8 py-6">
                     <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                        {cat.icon ?? "–"}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{cat.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[0.65rem] font-mono font-bold text-on-surface-variant opacity-40 bg-on-background/5 px-2 py-1 rounded w-fit">{cat.slug}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[0.7rem] text-on-surface-variant font-medium opacity-60 leading-relaxed max-w-[240px] line-clamp-2">{cat.description ?? "No scope defined"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <span className={`px-2.5 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border ${
                          cat.isActive ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-on-background/5 text-on-surface-variant border-surface-container-high"
                       }`}>
                          {cat.isActive ? "Nominal" : "Offline"}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => toggleActive(cat.id, cat.isActive)} disabled={isPending}
                      className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest gap-2 inline-flex items-center transition-all shadow-sm active:scale-95 ${
                         cat.isActive 
                            ? "bg-on-background text-white hover:bg-neutral-800" 
                            : "bg-primary text-white hover:shadow-brand"
                      }`}>
                      {cat.isActive ? <><EyeOff size={14} /> Deactivate</> : <><Eye size={14} /> Globalize</>}
                    </button>
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
