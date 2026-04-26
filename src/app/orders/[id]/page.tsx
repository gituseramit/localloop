import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { StatusBadge, Avatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@prisma/client";
import Link from "next/link";
import {
  ChevronLeft, MapPin, Package, Clock, Truck, User, Store,
  PhoneCall, Download, Star, MessageSquare, ShieldCheck
} from "lucide-react";
import type { Metadata } from "next";
import OrderActions from "./OrderActions";

const TIMELINE_STEPS = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      partner: { select: { id: true, shopName: true, city: true, lat: true, lng: true } },
      orderItems: { include: { serviceListing: { include: { category: true } } } },
      deliveryTasks: true,
      payment: true,
      reviews: true,
      dropAddress: true,
    },
  });

  if (!order) notFound();
  if (order.customerId !== session.user.id && session.user.role !== "ADMIN") redirect("/orders");

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "REJECTED" || order.status === "REFUNDED";
  const deliveryTask = order.deliveryTasks[0];

  return (
    <div className="space-y-10 animate-fade-in pb-32">
      <Link href="/orders" className="inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-primary transition-all group">
         <div className="w-8 h-8 rounded-full border border-surface-container-high flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronLeft size={16} />
         </div>
         Back to stream
      </Link>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Logical Operation Stream */}
        <div className="lg:col-span-8 space-y-8">
          {/* Node Identity Card */}
          <div className="card p-8 group overflow-hidden relative border-surface-container-high shadow-2xl shadow-primary/5 bg-surface-container-lowest">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-0 group-hover:opacity-5 blur-[60px] transition-opacity" />
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-surface-container-high">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <StatusBadge status={order.status} />
                   <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.1em] opacity-40">System Sequence</span>
                </div>
                <h1 className="text-3xl font-black text-on-surface tracking-tighter leading-tight">
                  Sequence No. <span className="text-primary">#{order.id.slice(-8).toUpperCase()}</span>
                </h1>
                <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div className="w-full md:w-auto p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-lg">
                    <Store size={20} className="text-white" />
                 </div>
                 <div className="flex-1 min-w-[140px]">
                    <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Operational Node</p>
                    <p className="text-sm font-black text-on-surface leading-tight">{order.partner.shopName}</p>
                 </div>
                 <a href={`tel:+91`} className="p-2.5 rounded-xl bg-on-background text-white hover:shadow-lg transition-all active:scale-95">
                    <PhoneCall size={16} />
                 </a>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-1">
                  <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Asset Count</p>
                  <p className="text-lg font-black text-on-surface">{order.orderItems.length} Nodes</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Yield Total</p>
                  <p className="text-lg font-black text-on-surface">{formatCurrency(order.totalAmount)}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Protocols</p>
                  <p className="text-lg font-black text-on-surface capitalize">{order.deliveryType.toLowerCase().replace("_", " ")}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[0.55rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Verification</p>
                  <p className="text-lg font-black text-on-surface">Secure</p>
               </div>
            </div>
          </div>

          {/* Logistics Sequence Timeline */}
          {!isCancelled && (
            <div className="card p-10 border-surface-container-high shadow-xl bg-surface-container-lowest">
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-xl font-black text-on-surface tracking-tighter uppercase">Logistics Sequence Status</h2>
               </div>
              <div className="relative space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = idx < currentStep;
                  const current = idx === currentStep;
                  return (
                    <div key={step} className="flex gap-6 relative group/step">
                      {/* Operational Connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-sm font-black transition-all z-10 shadow-sm ${
                          done ? "bg-green-500 border-green-500 text-white" :
                          current ? "bg-on-background border-on-background text-white shadow-lg scale-110" :
                          "bg-surface-container-low border-surface-container-high text-on-surface-variant opacity-40"
                        }`}>
                          {done ? <ShieldCheck size={18} /> : idx + 1}
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 flex-1 my-2 min-h-[40px] rounded-full transition-colors ${done ? "bg-green-500" : "bg-surface-container-high"}`} />
                        )}
                      </div>
                      <div className="pb-10 pt-2 flex-1">
                        <div className="flex items-center justify-between">
                           <h4 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${done || current ? "text-on-surface" : "text-on-surface-variant opacity-30"}`}>
                             {ORDER_STATUS_LABELS[step as OrderStatus]}
                           </h4>
                           {current && (
                             <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.6rem] font-black uppercase tracking-widest border border-primary/20 animate-pulse">
                                Live In-Process
                             </span>
                           )}
                        </div>
                        <p className={`text-[0.65rem] font-medium mt-1 transition-opacity ${done || current ? "text-on-surface-variant opacity-60" : "text-on-surface-variant opacity-20"}`}>
                           {current ? "Awaiting next sequence sync..." : done ? "Success verification complete." : "Sequence queued for processing."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exception Alerts */}
          {isCancelled && (
            <div className="card p-8 border-red-500/20 bg-red-500/5 backdrop-blur-sm shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                     <AlertCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-red-600 tracking-tighter uppercase">Sequence Terminated</h2>
                    <p className="text-sm font-bold text-red-600/60 uppercase tracking-widest mt-1">Status: {ORDER_STATUS_LABELS[order.status as OrderStatus]}</p>
                  </div>
               </div>
               {order.rejectionReason && (
                 <div className="mt-6 p-4 rounded-xl bg-white/50 border border-red-200">
                    <p className="text-[0.6rem] font-black text-red-400 uppercase tracking-widest mb-1">Rejection Reason Code</p>
                    <p className="text-sm font-medium text-red-900">{order.rejectionReason}</p>
                 </div>
               )}
            </div>
          )}

          {/* Tactical Asset List */}
          <div className="card p-0 overflow-hidden border-surface-container-high shadow-xl bg-surface-container-lowest">
            <div className="px-8 py-5 border-b border-surface-container-high bg-surface-container-low/30">
              <h2 className="text-[0.7rem] font-black text-on-surface uppercase tracking-[0.2em]">Asset Configuration</h2>
            </div>
            <div className="divide-y divide-surface-container-high">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-8 group hover:bg-surface-container-low/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                       <Package size={18} />
                    </div>
                    <div>
                      <p className="text-base font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{item.serviceListing.name}</p>
                      <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">{item.serviceListing.category.name}</p>
                      {item.instructions && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 border border-primary/10">
                           <MessageSquare size={12} className="text-primary" />
                           <p className="text-[0.6rem] font-black text-primary uppercase tracking-tight">Directive: {item.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-30">× {item.quantity}</p>
                    <p className="text-lg font-black text-on-surface tracking-tighter">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Operational Stats & Actions */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          {/* Settlement Summary */}
          <div className="card p-8 border-surface-container-high shadow-2xl bg-on-background text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-brand opacity-10 blur-[60px] group-hover:scale-150 transition-transform" />
            <h2 className="text-[0.7rem] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Yield Settlement</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-white/60">
                <span className="uppercase tracking-widest text-[0.6rem]">Gross Allocation</span>
                <span className="font-mono text-white/80">{formatCurrency(order.totalAmount - order.deliveryFee + order.discountAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm font-bold text-green-400">
                  <span className="uppercase tracking-widest text-[0.6rem]">Protocol Discount</span>
                  <span className="font-mono">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white/60 pb-6 border-b border-white/5">
                <span className="uppercase tracking-widest text-[0.6rem]">Logistics Supplement</span>
                <span className="font-mono text-white/80">+{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="pt-2 flex justify-between items-end">
                <span className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em]">Net Settlement</span>
                <span className="text-3xl font-black text-primary tracking-tighter leading-none">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[0.55rem] font-black text-white/20 uppercase tracking-[0.2em]">Auth Stage</span>
                 <span className={`text-[0.7rem] font-black tracking-widest uppercase mt-0.5 ${order.paymentStatus === "PAID" ? "text-green-500" : "text-amber-500"}`}>{order.paymentStatus}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                 <ShieldCheck size={18} />
              </div>
            </div>
          </div>

          <OrderActions orderId={order.id} status={order.status} />

          {/* Delivery Node Geolocation */}
          {order.dropAddress && (
            <div className="card p-8 border-surface-container-high shadow-xl bg-surface-container-lowest">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <MapPin size={16} />
                  </div>
                  <h3 className="text-[0.65rem] font-black text-on-surface uppercase tracking-[0.2em]">Destination Vector</h3>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-black text-on-surface leading-tight">
                    {order.dropAddress.line1}
                  </p>
                  <p className="text-xs font-medium text-on-surface-variant opacity-60 leading-relaxed">
                    {order.dropAddress.line2 ? `${order.dropAddress.line2}, ` : ""}
                    {order.dropAddress.city}, {order.dropAddress.state} – {order.dropAddress.pincode}
                  </p>
               </div>
            </div>
          )}

          {/* Strategic Support Terminal */}
          <Link href="/support" className="card p-6 flex items-center justify-between hover:border-primary/40 transition-all cursor-pointer group bg-surface-container-low/50">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface-variant group-hover:bg-on-background group-hover:text-white transition-all">
                  <MessageSquare size={18} />
               </div>
               <div>
                 <p className="text-[0.65rem] font-black text-on-surface uppercase tracking-[0.2em]">Command Desk</p>
                 <p className="text-[0.6rem] font-bold text-on-surface-variant/40 uppercase tracking-widest">Immediate Escalation</p>
               </div>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant opacity-20 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function getStepIndex(status: string) {
  return TIMELINE_STEPS.indexOf(status as never);
}

function AlertCircle({ size, className }: { size: number, className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function ChevronRight({ size, className }: { size: number, className?: string }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>; }
