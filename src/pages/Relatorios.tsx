import { DELIVERIES, CUSTOMERS, STAGE_META, DeliveryStage, OCCURRENCES_DATA, SERVICE_REQUESTS } from "@/data/mock";
import { PageHeader, Kpi } from "@/components/ui-kit";
import { BarChart3, TrendingUp, Package, Users, Clock, AlertTriangle, CheckCircle2, Inbox, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Period = "hoje" | "7d" | "30d";

export default function Relatorios() {
  const [period, setPeriod] = useState<Period>("7d");

  const totalActive = DELIVERIES.filter(d => d.stage !== "concluida").length;
  const totalDone = DELIVERIES.filter(d => d.stage === "concluida").length;
  const atRisk = DELIVERIES.filter(d => d.slaStatus !== "on_track").length;
  const openOccurrences = OCCURRENCES_DATA.filter(o => o.status !== "resolvida").length;

  const stageDistribution = (["solicitacao", "crossdocking", "preparacao", "execucao", "concluida"] as DeliveryStage[]).map(s => ({
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
  })).sort((a, b) => b.orders30 - a.orders30);

  // Type distribution
  const typeDistribution = [
    { label: "Entrega", count: DELIVERIES.filter(d => d.type === "entrega").length, color: "bg-primary" },
    { label: "Coleta", count: DELIVERIES.filter(d => d.type === "coleta").length, color: "bg-info" },
    { label: "Reentrega", count: DELIVERIES.filter(d => d.type === "reentrega").length, color: "bg-warning" },
    { label: "Remessa", count: DELIVERIES.filter(d => d.type === "remessa").length, color: "bg-success" },
  ];
  const maxType = Math.max(...typeDistribution.map(t => t.count));

  // Occurrence type distribution
  const occTypeDistribution = [
    { label: "Recusa", count: OCCURRENCES_DATA.filter(o => o.type === "recusa").length },
    { label: "Atraso", count: OCCURRENCES_DATA.filter(o => o.type === "atraso").length },
    { label: "Avaria", count: OCCURRENCES_DATA.filter(o => o.type === "avaria").length },
    { label: "Endereço", count: OCCURRENCES_DATA.filter(o => o.type === "endereco").length },
    { label: "Reentrega", count: OCCURRENCES_DATA.filter(o => o.type === "reentrega").length },
    { label: "Equipamento", count: OCCURRENCES_DATA.filter(o => o.type === "equipamento").length },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between">
        <PageHeader title="Relatórios" subtitle="Visão analítica da operação" />
        <div className="flex items-center gap-1 mb-5">
          {(["hoje", "7d", "30d"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 h-8 rounded-xl text-xs font-medium border transition",
                period === p ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {p === "hoje" ? "Hoje" : p === "7d" ? "7 dias" : "30 dias"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-6 gap-4">
        <Kpi label="Entregas ativas" value={totalActive} icon={Package} tone="primary" />
        <Kpi label="Concluídas" value={totalDone} icon={CheckCircle2} tone="success" trend="+12% vs sem. ant." />
        <Kpi label="SLA em risco" value={atRisk} icon={Clock} tone="warning" />
        <Kpi label="Ocorrências" value={openOccurrences} icon={AlertTriangle} tone="destructive" />
        <Kpi label="Solicitações" value={SERVICE_REQUESTS.length} icon={Inbox} tone="info" />
        <Kpi label="Clientes ativos" value={CUSTOMERS.length} icon={Users} tone="primary" />
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Stage distribution */}
        <div className="col-span-4 panel p-5 space-y-4">
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

        {/* Type distribution */}
        <div className="col-span-4 panel p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-primary"/>Distribuição por tipo</h3>
          <div className="space-y-3">
            {typeDistribution.map(t => (
              <div key={t.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{t.label}</span>
                  <span className="text-xs font-semibold tnum">{t.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", t.color)}
                    style={{ width: `${(t.count / maxType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occurrence types */}
        <div className="col-span-4 panel p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive"/>Tipos de ocorrência</h3>
          <div className="space-y-2.5">
            {occTypeDistribution.map(t => (
              <div key={t.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-destructive" style={{ width: `${(t.count / Math.max(...occTypeDistribution.map(x => x.count))) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold tnum w-4 text-right">{t.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client performance table */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary"/>Performance por cliente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Segmento</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Pedidos/30d</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Ativas</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Concluídas</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">OTIF</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">SLA</th>
              </tr>
            </thead>
            <tbody>
              {clientMetrics.map(c => (
                <tr key={c.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition">
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs">{c.segment}</td>
                  <td className="px-4 py-3.5 text-right tnum">{c.orders30}</td>
                  <td className="px-4 py-3.5 text-right tnum">{c.active}</td>
                  <td className="px-4 py-3.5 text-right tnum">{c.done}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={cn("font-semibold tnum", c.otif >= 97 ? "text-success" : c.otif >= 95 ? "text-warning" : "text-destructive")}>
                      {c.otif}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-muted-foreground">{c.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly trend (simulated) */}
      <div className="panel p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary"/>Tendência semanal (últimas 4 semanas)</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { week: "Sem 1", deliveries: 98, otif: 96.8, occurrences: 5 },
            { week: "Sem 2", deliveries: 112, otif: 97.2, occurrences: 4 },
            { week: "Sem 3", deliveries: 107, otif: 98.0, occurrences: 3 },
            { week: "Sem 4", deliveries: 127, otif: 98.2, occurrences: 2 },
          ].map((w, i) => (
            <div key={w.week} className="p-4 rounded-xl bg-surface-2 border border-border">
              <div className="text-xs text-muted-foreground mb-2">{w.week}</div>
              <div className="text-lg font-bold tnum">{w.deliveries}</div>
              <div className="text-xs text-muted-foreground">entregas</div>
              <div className="mt-2 flex items-center justify-between">
                <span className={cn("text-xs font-semibold tnum", w.otif >= 98 ? "text-success" : "text-warning")}>{w.otif}% OTIF</span>
                <span className="text-xs text-muted-foreground">{w.occurrences} ocorr.</span>
              </div>
              {i > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  {w.deliveries > [98, 112, 107, 127][i - 1] ? (
                    <ArrowUpRight className="h-3 w-3 text-success" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className="text-[10px] text-muted-foreground">vs anterior</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
