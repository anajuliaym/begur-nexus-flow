import { cn } from "@/lib/utils";
import { STATUS_META, OrderStatus } from "@/data/mock";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn(
      "chip transition-all duration-300 hover:scale-105",
      meta.tone
    )}>
      {meta.label}
    </span>
  );
}

export function SlaBadge({ sla }: { sla: "on_track" | "at_risk" | "breached" }) {
  const map = {
    on_track: { label: "On track", cls: "bg-success/10 text-success border-success/30" },
    at_risk: { label: "At risk", cls: "bg-warning/10 text-warning border-warning/30" },
    breached: { label: "Breached", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  } as const;
  return (
    <span className={cn(
      "chip transition-all duration-300 hover:scale-105",
      map[sla].cls,
      sla === "breached" && "badge-pulse"
    )}>
      <span className={cn(
        "inline-block w-1.5 h-1.5 rounded-full mr-1",
        sla === "on_track" && "bg-success",
        sla === "at_risk" && "bg-warning animate-pulse",
        sla === "breached" && "bg-destructive animate-pulse"
      )} />
      {map[sla].label}
    </span>
  );
}

export function Kpi({ label, value, delta, tone = "primary", icon: Icon }: any) {
  const toneCls: any = {
    primary: "text-primary", success: "text-success", warning: "text-warning",
    destructive: "text-destructive", info: "text-info",
  };
  return (
    <div className="panel p-4 relative overflow-hidden card-interactive group">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-gradient" />
      <div className="flex items-start justify-between">
        <div className="stat-label">{label}</div>
        {Icon && <Icon className={cn("h-3.5 w-3.5 transition-all duration-300 group-hover:scale-110", toneCls[tone])} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="stat-value number-animate">{value}</div>
        <div className={cn("text-xs font-semibold tnum animate-fade-in", toneCls[tone])} style={{ animationDelay: '200ms' }}>{delta}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5 animate-fade-in-down">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5 animate-fade-in" style={{ animationDelay: '150ms' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 stagger-children">{actions}</div>
    </div>
  );
}

export function Btn({ children, variant = "default", className, ...p }: any) {
  const v: any = {
    default: "bg-surface-2 hover:bg-surface-3 border border-border text-foreground hover:border-primary/30",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-lg",
    ghost: "hover:bg-accent text-foreground",
    outline: "border border-border hover:bg-accent hover:border-primary/30",
    danger: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
  };
  return (
    <button {...p} className={cn(
      "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all duration-200 btn-press hover-lift",
      v[variant], 
      className
    )}>
      {children}
    </button>
  );
}

export function Filters({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 stagger-children">
      {items.map((it, i) => (
        <button 
          key={it} 
          className={cn(
            "px-2.5 h-7 rounded-md text-xs font-medium border whitespace-nowrap transition-all duration-200 btn-press hover-scale",
            i === 0 ? "bg-primary/15 text-primary border-primary/30 animate-border-glow" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30"
          )}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
