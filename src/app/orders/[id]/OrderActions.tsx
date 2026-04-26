"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

export default function OrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Order updated");
      router.refresh();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  }

  const canCancel = ["PENDING", "ACCEPTED"].includes(status);

  if (!canCancel) return null;

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-sm text-neutral-900 mb-3">Order Actions</h3>
      {canCancel && (
        <button onClick={() => updateStatus("CANCELLED")} disabled={loading}
          className="btn btn-danger w-full btn-sm gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Cancel Order
        </button>
      )}
    </div>
  );
}
