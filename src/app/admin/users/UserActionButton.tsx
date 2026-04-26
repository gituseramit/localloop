"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldOff, UserCheck, Loader2 } from "lucide-react";

export default function UserActionButton({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        toast.success(isActive ? "User suspended" : "User reinstated");
        router.refresh();
      } else {
        toast.error("Action failed");
      }
    });
  }

  return (
    <button onClick={toggle} disabled={isPending}
      className={`btn btn-sm gap-1 ${isActive ? "btn-secondary" : "btn-success"}`}>
      {isPending ? <Loader2 size={13} className="animate-spin" /> : isActive ? <ShieldOff size={13} /> : <UserCheck size={13} />}
      {isActive ? "Suspend" : "Reinstate"}
    </button>
  );
}
