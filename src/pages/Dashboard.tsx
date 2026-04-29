import { PageHeader, Kpi, Btn, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { KPIS, BACKLOG_BY_STAGE, HANDOFFS, ORDERS, OCCURRENCES, STAGES, OWNERS_BY_STAGE, AI_RECS, STATUS_META, Stage } from "@/data/mock";
import { useMode } from "@/contexts/ModeContext";
import { ArrowRight, AlertTriangle, Clock, Sparkles, FileText, MessageCircle, Workflow, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { mode } = useMode();
  const breached = HANDOFFS.filter(h => h.sla === "breached").length;
  const atRisk = HANDOFFS.filter(h => h.sla === "at_risk").length;

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Torre de Controle"
        subtitle={mode === "real"
          ? "Operação Begur hoje — visão de workflow ponta a ponta. Cada estágio tem dono. Cada handoff tem SLA."
          : "Visão alvo — operação orquestrada por eventos, dado padronizado, copiloto ativo."}
        actions={<>
          <Btn>Hoje</Btn>
          <Btn variant="primary">Abrir mesa do analista</Btn>
        </>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {KPIS.map(k => <Kpi key={k.label} {...k} />)}
      </div>

      {/* Pipeline da entrega — backlog por etapa */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-semibold">Pipeline da entrega — backlog por etapa</div>
              <div className="text-[11px] text-muted-foreground">Cada estágio tem um dono. Operação real é cheia de idas e voltas.</div>
            </div>
          </div>
          <Link to="/workflow" className="text-xs text-primary hover:underline flex items-center gap-1">Ver fluxo completo <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-border">
          {BACKLOG_BY_STAGE.map((s, i) => (
            <div key={s.stage} className="bg-card p-3 hover:bg-accent/30 transition cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.stage}</div>
                <div className="text-[10px] text-muted-foreground tnum">#{i+1}</div>
              </div>
              <div className="text-2xl font-bold tnum">{s.count}</div>
              <div className="text-[10px] text-muted-foreground truncate" title={s.owner}>{s.owner}</div>
              <div className="flex items-center gap-2 mt-2 text-[10px]">
                {s.atRisk > 0 && <span className="text-warning font-semibold">⚠ {s.atRisk} risco</span>}
                {s.breached > 0 && <span className="text-destructive font-semibold">● {s.breached} estourado</span>}
                {s.atRisk === 0 && s.breached === 0 && <span className="text-success">✓ saudável</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Handoffs */}
        <div className="panel col-span-12 lg:col-span-7">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">Handoffs entre áreas</div>
                <div className="text-[11px] text-muted-foreground">Onde o trabalho está parado entre uma área e outra. {breached > 0 && <span className="text-destructive font-semibold">{breached} estourados.</span>} {atRisk > 0 && <span className="text-warning font-semibold ml-1">{atRisk} em risco.</span>}</div>
              </div>
            </div>
            <Btn>Reatribuir em massa</Btn>
          </div>
          <div className="divide-y divide-border">
            {HANDOFFS.map(h => (
              <div key={h.id} className="px-4 py-2.5 row-hover flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{
                  background: h.sla === "breached" ? "hsl(var(--destructive))" : h.sla === "at_risk" ? "hsl(var(--warning))" : "hsl(var(--success))"
                }} />
                <div className="text-xs font-mono text-muted-foreground w-20">{h.order}</div>
                <div className="flex items-center gap-1.5 text-xs flex-1">
                  <span className="text-muted-foreground truncate max-w-[160px]">{h.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-semibold truncate max-w-[180px]">{h.to}</span>
                </div>
                <span className="chip bg-surface-2 text-muted-foreground border-border">{h.stage}</span>
                {h.blocker && <span className="text-[11px] text-warning truncate max-w-[200px]" title={h.blocker}>⚠ {h.blocker}</span>}
                <div className="text-xs text-muted-foreground tnum w-16 text-right">{h.age}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modo Real: WhatsApp / NF física | Modo Alvo: AI recs */}
        {mode === "real" ? (
          <div className="panel col-span-12 lg:col-span-5">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-warning" />
                <div>
                  <div className="text-sm font-semibold">Dependências físicas / manuais hoje</div>
                  <div className="text-[11px] text-muted-foreground">A operação ainda passa por papel, foto e WhatsApp.</div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: FileText, label: "NF físicas pendentes de digitação", value: "12", note: "recepção CD Barueri", tone: "text-warning" },
                { icon: FileText, label: "Romaneios impressos aguardando assinatura", value: "7", note: "expedição turno tarde", tone: "text-warning" },
                { icon: MessageCircle, label: "Ocorrências reportadas só por WhatsApp", value: "18", note: "últimas 24h — não estruturadas", tone: "text-destructive" },
                { icon: FileText, label: "Comprovantes de entrega em foto não anexada", value: "23", note: "motoristas com canhoto pendente", tone: "text-destructive" },
                { icon: AlertTriangle, label: "Planilhas paralelas Excel ativas hoje", value: "9", note: "controle por área — ainda existe", tone: "text-warning" },
              ].map((it, i) => {
                const Icon = it.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-md bg-surface-2 border border-border">
                    <Icon className={cn("h-4 w-4", it.tone)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{it.label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{it.note}</div>
                    </div>
                    <div className={cn("text-xl font-bold tnum", it.tone)}>{it.value}</div>
                  </div>
                );
              })}
              <div className="text-[10px] text-muted-foreground italic pt-1">
                Estes itens viram a Fase 1 do roadmap: digitalizar o que ainda é papel/áudio.
              </div>
            </div>
          </div>
        ) : (
          <div className="panel col-span-12 lg:col-span-5">
            <div className="panel-header">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Recomendações do Copilot</div>
                  <div className="text-[11px] text-muted-foreground">Sugestões geradas sobre dado já padronizado.</div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {AI_RECS.map((r, i) => (
                <div key={i} className="p-3 row-hover">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <div className="text-xs font-semibold flex-1">{r.title}</div>
                    <span className={cn("chip text-[10px]", r.impact === "alta" ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30")}>{r.impact}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 ml-5">{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ocorrências críticas */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div>
              <div className="text-sm font-semibold">Ocorrências abertas — onde a operação realmente vive</div>
              <div className="text-[11px] text-muted-foreground">Tipologia real: espera 30min, recusa, reentrega, troca remessa, comprovante pendente.</div>
            </div>
          </div>
          <Link to="/occurrences" className="text-xs text-primary hover:underline">Ver todas</Link>
        </div>
        <div className="divide-y divide-border">
          {OCCURRENCES.slice(0, 5).map(o => (
            <div key={o.id} className="px-4 py-2.5 row-hover flex items-center gap-3">
              <span className={cn("chip text-[10px]", o.severity === "high" ? "bg-destructive/10 text-destructive border-destructive/30" : o.severity === "medium" ? "bg-warning/10 text-warning border-warning/30" : "bg-info/10 text-info border-info/30")}>{o.type}</span>
              <div className="text-xs font-mono text-muted-foreground w-20">{o.order}</div>
              <div className="text-xs flex-1 truncate">{o.client} — <span className="text-muted-foreground">{o.reason}</span></div>
              <div className="text-[11px] text-muted-foreground">{o.evidence}</div>
              <div className="text-xs text-muted-foreground w-32 truncate">{o.owner}</div>
              <div className="text-xs text-muted-foreground tnum w-16 text-right">{o.opened}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
