"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ShieldOff, Loader2 } from "lucide-react";

export default function PartnerApprovalActions({
  partnerId,
  isApproved = false,
  suspended = false,
}: {
  partnerId: string;
  isApproved?: boolean;
  suspended?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function action(type: "approve" | "reject" | "suspend" | "unsuspend") {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/partners/${partnerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: type }),
        });
        if (!res.ok) throw new Error();
        toast.success(`Partner ${type}d`);
        router.refresh();
      } catch {
        toast.error("Action failed");
      }
    });
  }

  if (!isApproved) {
    return (
      <div className="flex gap-2">
        <button onClick={() => action("approve")} disabled={isPending}
          className="btn btn-success btn-sm gap-1">
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Approve
        </button>
        <button onClick={() => action("reject")} disabled={isPending}
          className="btn btn-danger btn-sm gap-1">
          <XCircle size={13} /> Reject
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => action(suspended ? "unsuspend" : "suspend")} disabled={isPending}
      className={`btn btn-sm gap-1 ${suspended ? "btn-success" : "btn-secondary"}`}>
      {isPending ? <Loader2 size={13} className="animate-spin" /> : <ShieldOff size={13} />}
      {suspended ? "Reinstate" : "Suspend"}
    </button>
  );
}
