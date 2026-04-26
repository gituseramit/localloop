"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload, X, FileText, Truck, Building, UserCheck,
  Plus, Minus, Loader2, Tag, ArrowRight, AlertCircle
} from "lucide-react";
import { DELIVERY_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface ServiceListing {
  id: string;
  name: string;
  price: number;
  estimatedTime: string | null;
}

interface PartnerProfile {
  id: string;
  shopName: string;
}

export default function ServiceRequestForm({
  partner,
  services,
}: {
  partner: PartnerProfile;
  services: ServiceListing[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [deliveryType, setDeliveryType] = useState<"SELF_COLLECT" | "DELIVERY" | "PICKUP">("SELF_COLLECT");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeItem = (id: string) => setCart((c) => {
    const n = { ...c };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  const cartItems = services.filter((s) => cart[s.id]);
  const subtotal = cartItems.reduce((sum, s) => sum + s.price * cart[s.id], 0);
  const deliveryFee = deliveryType === "DELIVERY" ? 30 : 0;
  const total = subtotal + deliveryFee;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    if (cartItems.length === 0) { toast.error("Please add at least one service"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: partner.id,
          deliveryType,
          notes,
          couponCode: couponCode || undefined,
          items: cartItems.map((s) => ({
            serviceListingId: s.id,
            quantity: cart[s.id],
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Order placed successfully! 🎉");
      router.push(`/orders/${data.order.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  const DELIVERY_ICONS = {
    SELF_COLLECT: UserCheck,
    PICKUP: Building,
    DELIVERY: Truck,
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Asset Selector */}
      <div className="space-y-3">
        <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 ml-1">Asset Allocation</p>
        <div className="space-y-2">
           {services.map((service) => {
             const quantity = cart[service.id] ?? 0;
             return (
               <div key={service.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group/item ${
                 quantity > 0 ? "bg-primary/5 border-primary/30 shadow-sm" : "bg-white border-surface-container-high hover:border-primary/20"
               }`}>
                 <div className="flex-1 min-w-0 pr-4">
                   <p className="text-sm font-black text-on-surface leading-none mb-1.5 truncate group-hover/item:text-primary transition-colors">{service.name}</p>
                   <p className="text-[0.65rem] font-bold text-primary uppercase tracking-widest opacity-80">₹{service.price} / Unit</p>
                 </div>
                 <div className="flex items-center gap-3">
                   {quantity > 0 ? (
                     <div className="flex items-center gap-3 px-2 py-1 bg-white rounded-xl shadow-sm border border-surface-container-high animate-fade-in">
                       <button onClick={() => removeItem(service.id)}
                         className="w-7 h-7 rounded-lg border border-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-neutral-50 transition-colors">
                         <Minus size={12} />
                       </button>
                       <span className="w-4 text-center font-black text-sm text-on-surface">{quantity}</span>
                       <button onClick={() => addItem(service.id)}
                         className="w-7 h-7 rounded-lg bg-on-background text-white flex items-center justify-center hover:shadow-lg transition-all active:scale-95">
                         <Plus size={12} />
                       </button>
                     </div>
                   ) : (
                     <button onClick={() => addItem(service.id)}
                       className="px-5 py-2 rounded-xl bg-surface-container-high text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant hover:bg-on-background hover:text-white transition-all shadow-sm active:scale-95">
                       Deploy
                     </button>
                   )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Asset Ingestion Terminal */}
      <div className="space-y-3">
        <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 ml-1">Secure Ingestion</p>
        <div className="p-8 rounded-3xl bg-surface-container-low border-2 border-dashed border-surface-container-high hover:border-primary/30 transition-all cursor-pointer group text-center" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
             <Upload size={22} className="text-primary opacity-60" />
          </div>
          <p className="text-xs font-black text-on-surface uppercase tracking-widest">Protocol Ingest</p>
          <p className="text-[0.6rem] text-on-surface-variant font-medium mt-1 opacity-40 uppercase tracking-tighter">PDF, Word, Image · Max 05</p>
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-on-background/5 border border-on-background/10 text-[0.6rem] font-black text-on-surface uppercase tracking-widest">
                <FileText size={12} className="text-primary" /> <span className="truncate max-w-[120px]">{f.name}</span>
                <button onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, j) => j !== i)) }} className="p-0.5 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logic Overrides (Notes) */}
      <div className="space-y-3">
        <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 ml-1">Operational Directives</label>
        <textarea className="input resize-none h-24 text-xs font-medium p-4" placeholder="Enter special instructions or processing logic..."
          value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {/* Logistics Allocation */}
      <div className="space-y-3">
        <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 ml-1">Logistics Mode</p>
        <div className="grid grid-cols-3 gap-3">
          {(["SELF_COLLECT", "PICKUP", "DELIVERY"] as const).map((type) => {
            const Icon = DELIVERY_ICONS[type];
            const active = deliveryType === type;
            return (
              <button key={type} type="button" onClick={() => setDeliveryType(type)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  active ? "bg-on-background text-white border-on-background shadow-lg scale-[1.02]" : "bg-white text-on-surface-variant border-surface-container-high hover:border-primary/30"
                }`}>
                <Icon size={18} className={active ? "text-primary" : "opacity-40"} />
                <span className="text-[0.55rem] font-black uppercase tracking-[0.15em]">
                   {type === "SELF_COLLECT" ? "Self" : type === "PICKUP" ? "Pickup" : "Delivery"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Economic Incentives (Coupon) */}
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-20 group-focus-within:text-primary transition-colors" />
          <input className="input pl-12 text-xs font-black tracking-widest uppercase" placeholder="Promo Node" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
        </div>
        <button className="px-6 py-1 rounded-2xl bg-surface-container-high text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant hover:bg-on-background hover:text-white transition-all shadow-sm">Sync</button>
      </div>

      {/* Protocol Summary */}
      {cartItems.length > 0 && (
        <div className="rounded-3xl bg-surface-container-low border border-surface-container-high p-6 space-y-3 animate-fade-in shadow-inner">
          {cartItems.map((s) => (
            <div key={s.id} className="flex justify-between items-center text-[0.7rem] font-bold text-on-surface-variant">
              <span>{s.name} <span className="opacity-40 ml-1 font-black">× {cart[s.id]}</span></span>
              <span className="font-mono text-on-surface font-black opacity-80">{formatCurrency(s.price * cart[s.id])}</span>
            </div>
          ))}
          {deliveryFee > 0 && (
            <div className="flex justify-between items-center text-[0.7rem] font-bold text-primary">
              <span>Logistics Supplement</span>
              <span className="font-mono font-black">{formatCurrency(deliveryFee)}</span>
            </div>
          )}
          <div className="border-t border-surface-container-high pt-4 mt-2 flex justify-between items-end">
            <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Total Yield</span>
            <span className="text-2xl font-black text-primary tracking-tighter leading-none">{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      {/* Authorization Alert */}
      {!session && (
        <div className="flex items-center gap-3 text-[0.65rem] font-bold text-amber-600 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 animate-pulse">
          <AlertCircle size={16} /> 
          <span>Operational Authorization Required (Sign In Required)</span>
        </div>
      )}

      {/* Terminal Submit Action */}
      <button onClick={handleSubmit} disabled={loading || cartItems.length === 0}
        className={`btn w-full h-14 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-brand transition-all active:scale-95 ${
          loading || cartItems.length === 0 ? "opacity-40 grayscale pointer-events-none" : "btn-primary"
        }`}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>
          {session ? "Initiate Flow" : "System Login"} <ArrowRight size={18} />
        </>}
      </button>
    </div>
  );
}
