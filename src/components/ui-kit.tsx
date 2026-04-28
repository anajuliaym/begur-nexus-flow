import { cn } from "@/lib/utils";
import { STATUS_META, OrderStatus } from "@/data/mock";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return <span className={cn("chip", meta.tone)}>{meta.label}</span>;
}

export function SlaBadge({ sla }: { sla: "on_track" | "at_risk" | "breached" }) {
  const map = {
    on_track: { label: "On track", cls: "bg-success/10 text-success border-success/30" },
    at_risk: { label: "At risk", cls: "bg-warning/10 text-warning border-warning/30" },
    breached: { label: "Breached", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  } as const;
  return <span className={cn("chip", map[sla].cls)}>● {map[sla].label}</span>;
}

export function Kpi({ label, value, delta, tone = "primary", icon: Icon }: any) {
  const toneCls: any = {
    primary: "text-primary", success: "text-success", warning: "text-warning",
    destructive: "text-destructive", info: "text-info",
  };
  return (
    <div className="panel p-4 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="flex items-start justify-between">
        <div className="stat-label">{label}</div>
        {Icon && <Icon className={cn("h-3.5 w-3.5", toneCls[tone])} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="stat-value">{value}</div>
        <div className={cn("text-xs font-semibold tnum", toneCls[tone])}>{delta}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

export function Btn({ children, variant = "default", className, ...p }: any) {
  const v: any = {
    default: "bg-surface-2 hover:bg-surface-3 border border-border text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent text-foreground",
    outline: "border border-border hover:bg-accent",
    danger: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
  };
  return (
    <button {...p} className={cn("inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition", v[variant], className)}>
      {children}
    </button>
  );
}

export function Filters({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {items.map((it, i) => (
        <button key={it} className={cn(
          "px-2.5 h-7 rounded-md text-xs font-medium border whitespace-nowrap transition",
          i === 0 ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        )}>{it}</button>
      ))}
    </div>
  );
}
