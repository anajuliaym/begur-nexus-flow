import { DELIVERIES, CUSTOMERS, STAGE_META, DeliveryStage } from "@/data/mock";
import { PageHeader } from "@/components/ui-kit";
import { BarChart3, TrendingUp, Package, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Relatorios() {
  const totalActive = DELIVERIES.filter(d => d.stage !== "concluida").length;
  const totalDone = DELIVERIES.filter(d => d.stage === "concluida").length;
  const atRisk = DELIVERIES.filter(d => d.slaStatus !== "on_track").length;

  const stageDistribution = (["solicitacao", "preparacao", "execucao", "retorno", "concluida"] as DeliveryStage[]).map(s => ({
    stage: s,
    label: STAGE_META[s].label,
    count: DELIVERIES.filter(d => d.stage === s).length,
    color: STAGE_META[s].color,
  }));

  const maxCount = Math.max(...stageDistribution.map(s => s.count));

  const clientMetrics = CUSTOMERS.map(c => ({
    ...c,
    active: DELIVERIES.filter(d => d.client === c.name && d.stage !== "concluida").length,
    done: DELIVERIES.filter(d => d.client === c.name && d.stage === "concluida").length,
  }));

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <PageHeader title="Relatórios" subtitle="Visão analítica simplificada" />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Entregas ativas", value: totalActive, icon: Package, tone: "text-primary" },
          { label: "Concluídas", value: totalDone, icon: TrendingUp, tone: "text-success" },
          { label: "SLA em risco", value: atRisk, icon: Clock, tone: "text-warning" },
          { label: "Clientes ativos", value: CUSTOMERS.length, icon: Users, tone: "text-info" },
        ].map(s => (
          <div key={s.label} className="panel p-5">
            <div className="flex items-center justify-between">
              <span className="stat-label">{s.label}</span>
              <s.icon className={cn("h-4 w-4", s.tone)} />
            </div>
            <div className="stat-value mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Stage distribution */}
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary"/>Distribuição por etapa</h3>
          <div className="space-y-3">
            {stageDistribution.map(s => (
              <div key={s.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-semibold tnum">{s.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client performance */}
        <div className="panel p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary"/>Performance por cliente</h3>
          <div className="space-y-2">
            {clientMetrics.map(c => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.active} ativas · {c.done} concluídas</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-success tnum">{c.otif}%</div>
                  <div className="text-[10px] text-muted-foreground">OTIF</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
