import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELIVERIES, ANALYSTS, STAGE_META, OCCURRENCES_DATA, DeliveryStage, SERVICE_REQUESTS } from "@/data/mock";
import { StageBadge, SlaBadge, Kpi } from "@/components/ui-kit";
import { Package, AlertTriangle, Clock, CheckCircle2, TrendingUp, ChevronRight, User, Inbox, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENT_ANALYST = ANALYSTS[0];

export default function Dashboard() {
  const navigate = useNavigate();
  const myDeliveries = DELIVERIES.filter(d => d.analystId === CURRENT_ANALYST.id);
  const myOccurrences = OCCURRENCES_DATA.filter(o => o.owner === CURRENT_ANALYST.name);
  const pendingRequests = SERVICE_REQUESTS.filter(r => r.status === "pendente");

  const stageCounts = (stage: DeliveryStage) => myDeliveries.filter(d => d.stage === stage).length;
  const atRisk = myDeliveries.filter(d => d.slaStatus !== "on_track").length;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Analyst Header */}
      <div className="panel p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-lg font-bold text-primary-foreground shadow-glow">
            {CURRENT_ANALYST.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Bom dia, {CURRENT_ANALYST.name.split(" ")[0]} 👋</h1>
            <p className="text-sm text-muted-foreground">{CURRENT_ANALYST.role} · Responsável por {CURRENT_ANALYST.clients.join(", ")}</p>
          </div>
          <div className="flex gap-2">
            {CURRENT_ANALYST.clients.map(c => (
              <span key={c} className="chip bg-primary/10 text-primary border-primary/20 text-xs">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-5 gap-4">
        <Kpi label="Solicitações" value={pendingRequests.length} tone="info" icon={Inbox} trend="+3 hoje" />
        <Kpi label="Novas" value={stageCounts("solicitacao")} tone="info" icon={Clock} />
        <Kpi label="Cross-Docking" value={stageCounts("crossdocking")} tone="warning" icon={TrendingUp} />
        <Kpi label="Em execução" value={stageCounts("execucao")} tone="primary" icon={Package} />
        <Kpi label="Concluídas" value={stageCounts("concluida")} tone="success" icon={CheckCircle2} trend="+8 hoje" />
      </div>

      {/* Pending requests banner */}
      {pendingRequests.length > 0 && (
        <button 
          onClick={() => navigate("/solicitacoes")}
          className="w-full panel p-4 flex items-center gap-4 hover:bg-accent/30 transition border-info/30"
        >
          <div className="h-10 w-10 rounded-xl bg-info/10 grid place-items-center shrink-0">
            <Inbox className="h-5 w-5 text-info" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">{pendingRequests.length} solicitações aguardando análise</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendingRequests.slice(0, 3).map(r => r.client).join(", ")}
              {pendingRequests.length > 3 && ` e mais ${pendingRequests.length - 3}`}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Pipeline visual */}
        <div className="col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pipeline de entregas</h2>
            <button onClick={() => navigate("/entregas")} className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {(["solicitacao", "crossdocking", "execucao"] as DeliveryStage[]).map(stage => {
            const items = myDeliveries.filter(d => d.stage === stage);
            if (items.length === 0) return null;
            const meta = STAGE_META[stage];
            return (
              <div key={stage} className="panel">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <span className={cn("chip text-[10px]", meta.color)}>{meta.label}</span>
                    <span className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "caso" : "casos"}</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {items.slice(0, 5).map(d => (
                    <button
                      key={d.id}
                      onClick={() => navigate(`/entregas/${d.id}`)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-accent/40 transition text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                          <span className="text-sm font-medium">{d.client}</span>
                          <SlaBadge sla={d.slaStatus} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {d.destination} · {d.items.map(it => `${it.qty}× ${it.name}`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">{d.created}</div>
                        {d.driver && <div className="text-xs text-foreground mt-0.5 flex items-center gap-1"><User className="h-3 w-3"/>{d.driver}</div>}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                  {items.length > 5 && (
                    <div className="p-3 text-center">
                      <button onClick={() => navigate("/entregas")} className="text-xs text-primary hover:underline">
                        +{items.length - 5} mais
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Performance summary */}
          <div className="panel p-5">
            <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5 text-primary" />Performance do dia</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">OTIF</span>
                <span className="text-sm font-semibold text-success flex items-center gap-1">98.2% <ArrowUpRight className="h-3 w-3" /></span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: "98.2%" }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tempo médio de ciclo</span>
                <span className="text-sm font-semibold tnum">6h42min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Entregas hoje</span>
                <span className="text-sm font-semibold tnum flex items-center gap-1">14 <ArrowUpRight className="h-3 w-3 text-success" /></span>
              </div>
            </div>
          </div>

          {/* SLA Alerts */}
          {atRisk > 0 && (
            <div className="panel border-warning/30">
              <div className="panel-header">
                <span className="text-xs font-semibold text-warning flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5"/>SLA em risco</span>
              </div>
              <div className="divide-y divide-border">
                {myDeliveries.filter(d => d.slaStatus !== "on_track").slice(0, 4).map(d => (
                  <button key={d.id} onClick={() => navigate(`/entregas/${d.id}`)} className="w-full p-3 text-left hover:bg-accent/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono">{d.id}</span>
                      <SlaBadge sla={d.slaStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{d.client} · SLA {d.sla}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ocorrências abertas */}
          <div className="panel border-destructive/20">
            <div className="panel-header">
              <span className="text-xs font-semibold text-destructive flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5"/>Ocorrências pendentes</span>
              <button onClick={() => navigate("/ocorrencias")} className="text-[10px] text-primary hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-border">
              {myOccurrences.filter(o => o.status !== "resolvida").slice(0, 4).map(o => (
                <div key={o.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono">{o.id}</span>
                    <span className={cn("chip text-[10px]", o.severity === "high" ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30")}>
                      {o.severity === "high" ? "Alta" : o.severity === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clientes do analista */}
          <div className="panel">
            <div className="panel-header">
              <span className="text-xs font-semibold">Meus clientes</span>
            </div>
            <div className="divide-y divide-border">
              {CURRENT_ANALYST.clients.map(clientName => {
                const clientDeliveries = DELIVERIES.filter(d => d.client === clientName);
                const active = clientDeliveries.filter(d => d.stage !== "concluida").length;
                return (
                  <div key={clientName} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{clientName}</div>
                      <div className="text-xs text-muted-foreground">{active} entregas ativas</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
