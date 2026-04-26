import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp, IndianRupee, Package, Calendar,
  BarChart2, ArrowUpRight
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partner Earnings" };

export default async function PartnerEarningsPage() {
  const session = await auth();
  if (!session || session.user.role !== "PARTNER") redirect("/login");

  const partner = await prisma.partnerProfile.findUnique({ where: { userId: session.user.id } });
  if (!partner) redirect("/partner/register");

  const allOrders = await prisma.order.findMany({
    where: { partnerId: partner.id, paymentStatus: "PAID" },
    select: { partnerEarning: true, platformFee: true, totalAmount: true, createdAt: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  const completed = allOrders.filter((o) => ["DELIVERED", "COMPLETED"].includes(o.status));
  const totalEarned = completed.reduce((s, o) => s + o.partnerEarning, 0);
  const totalGMV = completed.reduce((s, o) => s + o.totalAmount, 0);
  const platformCut = completed.reduce((s, o) => s + o.platformFee, 0);

  // Monthly breakdown – last 6 months
  const monthlyData: Record<string, { earned: number; orders: number }> = {};
  for (const o of completed) {
    const key = new Date(o.createdAt).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    if (!monthlyData[key]) monthlyData[key] = { earned: 0, orders: 0 };
    monthlyData[key].earned += o.partnerEarning;
    monthlyData[key].orders++;
  }
  const monthlyRows = Object.entries(monthlyData).slice(0, 6);

  return (
    <div>
      <PageHeader title="Earnings" subtitle="Your commission and payout overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Earned", value: formatCurrency(totalEarned), icon: IndianRupee, color: "text-green-600", bg: "#f0fdf4" },
          { label: "Total GMV", value: formatCurrency(totalGMV), icon: TrendingUp, color: "text-blue-600", bg: "#eff6ff" },
          { label: "Platform Fee", value: formatCurrency(platformCut), icon: BarChart2, color: "text-purple-600", bg: "#fdf4ff" },
          { label: "Paid Orders", value: completed.length, icon: Package, color: "text-orange-600", bg: "#fff7ed" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-neutral-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly table */}
      {monthlyRows.length > 0 ? (
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-bold text-neutral-900">Monthly Breakdown</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-5 py-3 text-left text-xs font-bold text-neutral-500 uppercase">Month</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-neutral-500 uppercase">Orders</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-neutral-500 uppercase">You Earned</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map(([month, data]) => (
                <tr key={month} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-medium text-neutral-900">{month}</td>
                  <td className="px-5 py-3 text-right text-neutral-600">{data.orders}</td>
                  <td className="px-5 py-3 text-right font-bold text-green-700">{formatCurrency(data.earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<IndianRupee size={28} className="text-neutral-400" />}
          title="No earnings yet"
          description="Complete your first order to start tracking earnings."
        />
      )}

      {/* Commission info */}
      <div className="card p-5 mt-5">
        <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <BarChart2 size={16} className="text-blue-600" /> Commission Structure
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: "Order Amount", value: "100%" },
            { label: "Platform Fee", value: `${partner.commissionRate}%` },
            { label: "You Keep", value: `${100 - partner.commissionRate}% + Delivery` },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
              <p className="text-neutral-500 text-xs mb-1">{item.label}</p>
              <p className="font-bold text-neutral-900 text-lg">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
