import { OCCURRENCES_DATA } from "@/data/mock";
import { PageHeader, Btn } from "@/components/ui-kit";
import { AlertTriangle, CheckCircle2, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  aberta: { label: "Aberta", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  em_analise: { label: "Em análise", cls: "bg-warning/10 text-warning border-warning/30" },
  resolvida: { label: "Resolvida", cls: "bg-success/10 text-success border-success/30" },
};

const SEVERITY_LABELS: Record<string, { label: string; cls: string }> = {
  high: { label: "Alta", cls: "text-destructive" },
  medium: { label: "Média", cls: "text-warning" },
  low: { label: "Baixa", cls: "text-muted-foreground" },
};

const TYPE_LABELS: Record<string, string> = {
  recusa: "Recusa", avaria: "Avaria", atraso: "Atraso", endereco: "Endereço", reentrega: "Reentrega", equipamento: "Equipamento",
};

export default function OcorrenciasPage() {
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  const filtered = OCCURRENCES_DATA.filter(o => filter === "all" || o.status === filter);

  return (
    <div className="p-6 space-y-5 max-w-[1200px] mx-auto">
      <PageHeader
        title="Ocorrências"
        subtitle="Exceções e problemas que precisam de tratamento"
      />

      <div className="flex items-center gap-2 border-b border-border pb-0">
        {[
          { key: "all", label: "Todas", count: OCCURRENCES_DATA.length },
          { key: "aberta", label: "Abertas", count: OCCURRENCES_DATA.filter(o => o.status === "aberta").length },
          { key: "em_analise", label: "Em análise", count: OCCURRENCES_DATA.filter(o => o.status === "em_analise").length },
          { key: "resolvida", label: "Resolvidas", count: OCCURRENCES_DATA.filter(o => o.status === "resolvida").length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium border-b-2 transition -mb-px",
              filter === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="divide-y divide-border">
          {filtered.map(o => {
            const sev = SEVERITY_LABELS[o.severity];
            const st = STATUS_LABELS[o.status];
            return (
              <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition">
                <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0",
                  o.status === "resolvida" ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {o.status === "resolvida" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{o.id}</span>
                    <span className="text-sm font-medium">{TYPE_LABELS[o.type] || o.type}</span>
                    <span className={cn("chip text-[10px]", st.cls)}>{st.label}</span>
                    <span className={cn("text-[10px] font-semibold", sev.cls)}>● {sev.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <button
                    onClick={() => navigate(`/entregas/${o.deliveryId}`)}
                    className="text-xs text-primary hover:underline"
                  >{o.deliveryId}</button>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{o.opened}</div>
                  <div className="text-[11px] text-muted-foreground">{o.owner}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
