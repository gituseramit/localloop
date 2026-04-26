"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";
import { CheckCircle2, XCircle, Loader2, Package, ChevronDown, ChevronUp, Upload } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; value: OrderStatus; color: string }[]>> = {
  PENDING: [
    { label: "Accept", value: "ACCEPTED", color: "success" },
    { label: "Reject", value: "REJECTED", color: "danger" },
  ],
  ACCEPTED: [
    { label: "Start Work", value: "IN_PROGRESS", color: "primary" },
  ],
  IN_PROGRESS: [
    { label: "Mark Complete", value: "COMPLETED", color: "success" },
    { label: "Needs Pickup", value: "AWAITING_PICKUP", color: "primary" },
  ],
  COMPLETED: [
    { label: "Out for Delivery", value: "OUT_FOR_DELIVERY", color: "primary" },
  ],
  AWAITING_PICKUP: [],
};

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  partnerEarning: number;
  deliveryType: string;
  notes: string | null;
  createdAt: Date;
  customer: { name: string; phone: string | null; email: string | null };
  orderItems: { id: string; quantity: number; unitPrice: number; instructions: string | null; fileUrls: unknown; serviceListing: { name: string } }[];
}

function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(order.status === "PENDING");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  async function updateStatus(status: OrderStatus, reason?: string) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, rejectionReason: reason }),
        });
        if (!res.ok) throw new Error();
        toast.success(`Order ${status.toLowerCase().replace("_", " ")}`);
        router.refresh();
      } catch {
        toast.error("Failed to update order");
      }
    });
  }

  const actions = NEXT_STATUS[order.status] ?? [];

  return (
    <div className={`card overflow-hidden ${order.status === "PENDING" ? "border-amber-300 shadow-amber-100" : ""}`}
      style={order.status === "PENDING" ? { boxShadow: "0 0 0 2px #fde68a" } : {}}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          order.status === "PENDING" ? "bg-amber-100" : "bg-blue-100"
        }`}>
          <Package size={18} className={order.status === "PENDING" ? "text-amber-700" : "text-blue-700"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-neutral-900 text-sm">#{order.id.slice(-8).toUpperCase()}</p>
            <StatusBadge status={order.status} size="sm" />
            {order.status === "PENDING" && (
              <span className="badge bg-amber-100 text-amber-800 text-xs animate-pulse">⚡ New</span>
            )}
          </div>
          <p className="text-sm text-neutral-600 truncate">
            {order.customer.name} · {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="font-bold text-blue-700">{formatCurrency(order.totalAmount)}</p>
            <p className="text-xs text-green-600">Earn: {formatCurrency(order.partnerEarning)}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-neutral-100 p-4 space-y-4">
          {/* Items */}
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Services Requested</p>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 rounded-xl bg-neutral-50">
                  <div>
                    <p className="font-medium text-sm text-neutral-900">{item.serviceListing.name}</p>
                    <p className="text-xs text-neutral-500">qty: {item.quantity}</p>
                    {item.instructions && (
                      <p className="text-xs text-blue-600 mt-0.5">📌 {item.instructions}</p>
                    )}
                    {Array.isArray(item.fileUrls) && (item.fileUrls as string[]).length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {(item.fileUrls as string[]).map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Upload size={10} /> File {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-bold text-blue-600 mb-1">Customer Note</p>
              <p className="text-sm text-neutral-700">{order.notes}</p>
            </div>
          )}

          {/* Delivery type */}
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="font-medium">Delivery:</span>
            <span>{order.deliveryType === "SELF_COLLECT" ? "🚶 Self Collect" : order.deliveryType === "PICKUP" ? "🏪 Partner Pickup" : "🛵 Home Delivery"}</span>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {actions.map((action) => (
                <button key={action.value}
                  onClick={() => {
                    if (action.value === "REJECTED") { setShowRejectModal(true); return; }
                    updateStatus(action.value);
                  }}
                  disabled={isPending}
                  className={`btn btn-sm gap-1.5 ${
                    action.color === "success" ? "btn-success" :
                    action.color === "danger" ? "btn-danger" : "btn-primary"
                  }`}>
                  {isPending ? <Loader2 size={13} className="animate-spin" /> : (
                    action.color === "success" ? <CheckCircle2 size={13} /> :
                    action.color === "danger" ? <XCircle size={13} /> : null
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Reject modal */}
          {showRejectModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="card p-6 w-full max-w-md">
                <h3 className="font-bold text-neutral-900 mb-3">Reject Order</h3>
                <textarea className="input resize-none h-24 mb-4" placeholder="Reason for rejection (shown to customer)..."
                  value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                  <button onClick={() => { setShowRejectModal(false); updateStatus("REJECTED", rejectionReason); }}
                    className="btn btn-danger flex-1">Confirm Reject</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PartnerOrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState("active");

  const filtered = orders.filter((o) => {
    if (filter === "active") return !["DELIVERED", "CANCELLED", "REJECTED", "REFUNDED"].includes(o.status);
    if (filter === "completed") return ["DELIVERED", "COMPLETED"].includes(o.status);
    if (filter === "pending") return o.status === "PENDING";
    return true;
  });

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6 w-fit">
        {[
          { key: "active", label: "Active" },
          { key: "pending", label: "Pending" },
          { key: "completed", label: "Completed" },
          { key: "all", label: "All" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}>
            {tab.label}
            {tab.key === "pending" && orders.filter((o) => o.status === "PENDING").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {orders.filter((o) => o.status === "PENDING").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📦</div>
          <p className="font-semibold text-neutral-700">No {filter} orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
