"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AvailabilityToggle({ agentId, isAvailable }: { agentId: string; isAvailable: boolean }) {
  const [available, setAvailable] = useState(isAvailable);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/delivery/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, isAvailable: !available }),
      });
      if (!res.ok) throw new Error();
      setAvailable(!available);
      toast.success(`You are now ${!available ? "available" : "offline"}`);
      router.refresh();
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
        available
          ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
          : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
      }`}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : (
        <span className={`w-2.5 h-2.5 rounded-full ${available ? "bg-green-500" : "bg-neutral-400"}`} />
      )}
      {available ? "Available" : "Go Online"}
    </button>
  );
}
