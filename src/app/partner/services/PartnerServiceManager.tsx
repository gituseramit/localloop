"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, Check, X, Eye, EyeOff, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Category { id: string; name: string; icon: string | null; }
interface Service { id: string; name: string; description: string | null; price: number; estimatedTime: string | null; isActive: boolean; category: Category; }
interface Partner { id: string; }

export default function PartnerServiceManager({
  partner, services, categories,
}: {
  partner: Partner;
  services: Service[];
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ categoryId: "", name: "", description: "", price: "", estimatedTime: "" });

  async function createService() {
    if (!form.categoryId || !form.name || !form.price) { toast.error("Fill in required fields"); return; }
    startTransition(async () => {
      const res = await fetch("/api/partner/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, partnerId: partner.id, price: parseFloat(form.price) }),
      });
      if (res.ok) {
        toast.success("Asset initialized successfully");
        setShowAdd(false);
        setForm({ categoryId: "", name: "", description: "", price: "", estimatedTime: "" });
        router.refresh();
      } else toast.error("Failed to initialize asset");
    });
  }

  async function toggleService(id: string, isActive: boolean) {
    startTransition(async () => {
      await fetch(`/api/partner/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    });
  }

  // Group by category
  const grouped: Record<string, Service[]> = {};
  for (const s of services) {
    const key = s.category.name;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low p-8 rounded-3xl border border-surface-container-high shadow-sm">
        <div className="space-y-1">
           <h2 className="text-2xl font-black text-on-surface tracking-tighter">Inventory Architecture</h2>
           <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest opacity-40">Manage operational service protocols</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={`btn font-black text-xs uppercase tracking-[0.2em] px-8 h-12 shadow-brand group transition-all ${
           showAdd ? "btn-secondary" : "btn-primary"
        }`}>
          {showAdd ? <><X size={16} /> Close Terminal</> : <><Plus size={16} className="group-hover:rotate-90 transition-transform" /> Deploy New Asset</>}
        </button>
      </div>

      {showAdd && (
        <div className="card p-10 mb-8 border-primary/20 shadow-brand animate-fade-in bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-5 blur-[60px]" />
          <div className="relative z-10">
            <h3 className="text-[0.7rem] font-black text-primary uppercase tracking-[0.3em] mb-8">Asset Initialization Protocol</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Core Domain *</label>
                <select className="input h-12 text-xs font-black uppercase tracking-wider" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Select Domain</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Asset Identity *</label>
                <input className="input h-12 text-xs font-bold" placeholder="e.g. Laser Matrix Print" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Yield Value (₹) *</label>
                <input className="input h-12 text-xs font-mono font-bold" type="number" min="0" step="0.5" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Temporal Sync</label>
                <input className="input h-12 text-xs font-bold" placeholder="e.g. 15m Sequence" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-4">
                <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 ml-1">Operational Logic</label>
                <textarea className="input h-24 text-xs font-medium p-4 resize-none" placeholder="Provide detailed specifications for this service asset..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-surface-container-high">
              <button onClick={createService} disabled={isPending} className="btn btn-primary h-12 px-10 font-black text-xs uppercase tracking-[0.2em] shadow-brand active:scale-95">
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Commit Asset
              </button>
              <button onClick={() => setShowAdd(false)} className="btn btn-secondary h-12 px-10 font-black text-xs uppercase tracking-[0.2em] active:scale-95">Discard</button>
            </div>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="card py-32 flex flex-col items-center justify-center text-center bg-surface-container-low/20 border-dashed border-2 border-surface-container-high">
          <div className="w-20 h-20 rounded-[2rem] bg-surface-container-high flex items-center justify-center mb-8 shadow-inner">
             <Plus size={32} className="text-on-surface-variant opacity-20" />
          </div>
          <h3 className="text-2xl font-black text-on-surface tracking-tighter mb-2">No Assets Linked</h3>
          <p className="text-sm text-on-surface-variant font-medium opacity-60 max-w-xs">Your inventory architecture is currently offline. Deploy your first service protocol to begin.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catServices]) => (
            <div key={cat} className="card p-0 overflow-hidden border-surface-container-high shadow-xl bg-surface-container-lowest">
              <div className="px-8 flex items-center justify-between h-16 bg-surface-container-low/50 border-b border-surface-container-high">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-primary rounded-full" />
                   <h3 className="text-[0.7rem] font-black text-on-surface uppercase tracking-[0.2em]">{cat} Domain</h3>
                </div>
                <span className="px-3 py-1 rounded-lg bg-on-background/5 text-[0.6rem] font-black text-on-surface uppercase tracking-widest">{catServices.length} Vectors</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-surface-container-high">
                        <th className="px-8 py-4 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em]">Service Specification</th>
                        <th className="px-8 py-4 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Yield</th>
                        <th className="px-8 py-4 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">Protocol Status</th>
                        <th className="px-8 py-4 text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {catServices.map((s) => (
                      <tr key={s.id} className="hover:bg-surface-container-low/30 transition-all group">
                        <td className="px-8 py-6">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{s.name}</p>
                              {s.description && <p className="text-[0.7rem] text-on-surface-variant font-medium opacity-60 leading-relaxed max-w-sm">{s.description}</p>}
                              {s.estimatedTime && (
                                <div className="flex items-center gap-1.5 mt-2 opacity-40">
                                   <Loader2 size={12} className="animate-spin-slow" />
                                   <span className="text-[0.6rem] font-black uppercase tracking-widest">{s.estimatedTime} Sync</span>
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-base font-black text-on-surface tracking-tighter">{formatCurrency(s.price)}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex justify-center">
                              <span className={`px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest shadow-sm border ${
                                 s.isActive 
                                    ? "bg-green-500/10 text-green-600 border-green-500/20" 
                                    : "bg-on-background/5 text-on-surface-variant border-surface-container-high"
                              }`}>
                                {s.isActive ? "Live" : "Deactivated"}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => toggleService(s.id, s.isActive)} disabled={isPending}
                            className={`px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest gap-2 inline-flex items-center transition-all shadow-sm active:scale-95 ${
                               s.isActive 
                                  ? "bg-on-background text-white hover:bg-neutral-800" 
                                  : "bg-primary text-white hover:shadow-brand"
                            }`}>
                            {s.isActive ? <><EyeOff size={14} /> Deactivate</> : <><Eye size={14} /> Reactivate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
