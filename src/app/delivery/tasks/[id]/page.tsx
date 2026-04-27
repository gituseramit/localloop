import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft, MapPin, Package, CheckCircle2 } from "lucide-react";

export default async function DeliveryTaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "DELIVERY_AGENT") redirect("/login");

  const resolvedParams = await params;
  const prisma = new PrismaClient();
  const task = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: { service: true, user: true, partner: true }
  });

  if (!task || task.deliveryAgentId !== session.user.id) {
    return (
      <div className="p-12 text-center text-on-surface">Task not found or permission denied in matrix layout.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link href="/delivery/tasks" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-amber-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-background tracking-tight">Task Context</h1>
          <p className="text-on-surface-variant mt-1 font-mono text-xs">LOC: {task.id}</p>
        </div>
        <span className="px-4 py-2 text-sm font-bold tracking-widest uppercase bg-amber-500/10 text-amber-600 rounded-lg whitespace-nowrap">
          {task.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-outline-variant space-y-4">
          <h3 className="font-bold text-on-surface border-b border-outline-variant pb-2">Payload Details</h3>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-on-surface font-semibold">{task.service.title}</p>
              <p className="text-on-surface-variant text-sm">Qty: {task.quantity}x</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-outline-variant space-y-4">
          <h3 className="font-bold text-on-surface border-b border-outline-variant pb-2">Logistics Vector</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <p className="text-on-surface font-semibold">User: {task.user.name}</p>
              <p className="text-on-surface-variant text-sm">Target Location is masked pending protocol arrival.</p>
            </div>
          </div>
        </div>
      </div>

      {task.status !== "COMPLETED" && (
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold text-on-surface">Execute Payload Handover</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto">Confirm delivery strictly after payload passes to the customer.</p>
          <button className="btn font-black bg-amber-500 text-white hover:bg-amber-600 px-10 h-14 w-full md:w-auto shadow-brand">Mark Completed</button>
        </div>
      )}
    </div>
  );
}
