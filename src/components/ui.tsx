import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import type { OrderStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status];
  const colorClass = ORDER_STATUS_COLORS[status];
  const sizeClass = size === "sm" ? "text-[0.7rem] px-2 py-0.5" : "text-[0.75rem] px-2.5 py-1";
  return (
    <span className={`badge ${colorClass} ${sizeClass} shadow-sm whitespace-nowrap`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="glass p-8 group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity" />
      <div className="flex justify-between items-start mb-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 scale-100 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: color || 'var(--primary)' }}
        >
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40 mb-1">{label}</p>
          <p className="text-3xl font-black text-on-surface tracking-tighter leading-none">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 pt-4 border-t border-on-surface/5">
          <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{trend}</span>
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-surface-container-low border border-dashed border-outline-variant">
      <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center mb-5 text-4xl shadow-sm border border-surface-container-high transition-transform hover:scale-105">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-10">
      <div
        style={{ width: size, height: size }}
        className="border-2 border-surface-container-high border-t-primary rounded-full animate-spin shadow-sm"
      />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode; }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-on-surface-variant mt-1.5 font-medium opacity-80">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 animate-fade-in">{action}</div>}
    </div>
  );
}

export function Avatar({ name, size = 40, src, className }: { name: string; size?: number; src?: string | null; className?: string }) {
  if (src) return (
    <div className={`relative inline-block border-2 border-surface-container-high rounded-full overflow-hidden shadow-sm ${className}`} style={{ width: size, height: size }}>
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  );
  
  const initials = name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <div className={`gradient-brand rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-brand border-2 border-surface-container-highest ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}
