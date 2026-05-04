import { cn } from "@/lib/utils";
import { STAGE_META, DeliveryStage } from "@/data/mock";
import { LucideIcon } from "lucide-react";

export function StageBadge({ stage }: { stage: DeliveryStage }) {
  const meta = STAGE_META[stage];
  return <span className={cn("chip", meta.color)}>{meta.label}</span>;
}

export function SlaBadge({ sla }: { sla: "on_track" | "at_risk" | "breached" }) {
  const map = {
    on_track: { label: "No prazo", cls: "bg-success/10 text-success border-success/30" },
    at_risk: { label: "Em risco", cls: "bg-warning/10 text-warning border-warning/30" },
    breached: { label: "Atrasado", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  } as const;
  return <span className={cn("chip", map[sla].cls)}>● {map[sla].label}</span>;
}

export function Kpi({ label, value, tone = "primary", icon: Icon, trend }: {
  label: string;
  value: number;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
  icon?: LucideIcon;
  trend?: string;
}) {
  const toneCls: Record<string, string> = {
    primary: "text-primary", success: "text-success", warning: "text-warning",
    destructive: "text-destructive", info: "text-info",
  };
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <div className="stat-label">{label}</div>
        {Icon && <Icon className={cn("h-4 w-4", toneCls[tone])} />}
      </div>
      <div className="mt-2 stat-value">{value}</div>
      {trend && <div className="text-[10px] text-muted-foreground mt-1">{trend}</div>}
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
  const v: Record<string, string> = {
    default: "bg-surface-2 hover:bg-surface-3 border border-border text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    ghost: "hover:bg-accent text-foreground",
    outline: "border border-border hover:bg-accent",
    danger: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25",
  };
  return (
    <button {...p} className={cn("inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-medium transition", v[variant], className)}>
      {children}
    </button>
  );
}

export function Filters({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {items.map((it, i) => (
        <button key={it} className={cn(
          "px-3 h-8 rounded-xl text-xs font-medium border whitespace-nowrap transition",
          i === 0 ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        )}>{it}</button>
      ))}
    </div>
  );
}

export function WorkflowSteps({ current, stages }: { current: number; stages: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            "workflow-step-dot",
            i < current ? "done" : i === current ? "active" : "pending"
          )}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={cn("text-xs font-medium", i <= current ? "text-foreground" : "text-muted-foreground")}>{s}</span>
          {i < stages.length - 1 && <div className={cn("w-8 h-px", i < current ? "bg-success" : "bg-border")} />}
        </div>
      ))}
    </div>
  );
}
