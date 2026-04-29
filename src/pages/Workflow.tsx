import { PageHeader, Btn } from "@/components/ui-kit";
import { STAGES, OWNERS_BY_STAGE, BACKLOG_BY_STAGE, HANDOFFS, Stage } from "@/data/mock";
import { ArrowRight, ArrowDown, RotateCcw, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGE_DETAIL: Record<Stage, { actor: string; inputs: string[]; outputs: string[]; tools: string[]; pain: string }> = {
  Intake: {
    actor: "Sistema + Operador de e-mail",
    inputs: ["E-mail (livre + planilha)", "WhatsApp (texto/áudio/foto)", "API Lincros / Code Service", "NF física na recepção", "Portal do cliente"],
    outputs: ["Entrada bruta com origem identificada"],
    tools: ["Parser de e-mail", "OCR de NF", "Transcrição WhatsApp"],
    pain: "Cada cliente manda em formato diferente. Nasce sem padrão.",
  },
  Atendimento: {
    actor: "Mesa do Analista",
    inputs: ["Entrada normalizada", "Contato do cliente"],
    outputs: ["OS emitida no padrão Begur", "Pedido validado"],
    tools: ["Mesa do Analista", "De-para por cliente", "Histórico"],
    pain: "Hoje é Excel + e-mail. Sem fila clara nem ownership.",
  },
  "Armazém": {
    actor: "Operador de Cross-dock + Conferente",
    inputs: ["OS", "Mercadoria física", "Romaneio"],
    outputs: ["Carga separada e conferida", "Serial bipado"],
    tools: ["WMS", "Bipador", "Romaneio impresso"],
    pain: "Conferência manual + serial bipado. Erro custa caro.",
  },
  "Distribuição": {
    actor: "Roteirizador",
    inputs: ["Carga conferida", "Janelas, regras cliente, frota disponível"],
    outputs: ["Viagem composta + manifesto"],
    tools: ["Mapa", "Lincros (futuro)", "Excel (hoje)"],
    pain: "Hoje rota manual com Google Maps + regra na cabeça.",
  },
  Expedição: {
    actor: "Líder de Doca",
    inputs: ["Manifesto", "Veículo", "Motorista"],
    outputs: ["Carga conferida e carregada", "Motorista liberado"],
    tools: ["Romaneio impresso", "Conferência manual"],
    pain: "Assinatura em papel ainda manda na liberação.",
  },
  Transporte: {
    actor: "Motorista / Agregado",
    inputs: ["Manifesto", "Sequência de paradas"],
    outputs: ["Eventos de entrega", "Comprovante (foto/canhoto)"],
    tools: ["WhatsApp (hoje)", "App do Motorista (alvo)"],
    pain: "Hoje status volta por WhatsApp. Não estruturado.",
  },
  Monitoramento: {
    actor: "Squad de Monitoramento",
    inputs: ["Eventos do motorista", "Reclamação cliente"],
    outputs: ["Ocorrência tratada", "Reentrega agendada", "Cliente comunicado"],
    tools: ["Tipologia de ocorrência", "Régua de comunicação"],
    pain: "Mistura WhatsApp + planilha + e-mail. Perde contexto.",
  },
  Financeiro: {
    actor: "Back-office Financeiro",
    inputs: ["Comprovante", "Acerto agregado", "SLA cumprido"],
    outputs: ["Faturamento", "Pagamento agregado"],
    tools: ["ERP", "Quinzena de acerto"],
    pain: "Sem comprovante = sem fechamento. Backlog vira atrito.",
  },
};

export default function WorkflowPage() {
  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Fluxo da entrega — workflow real Begur"
        subtitle="O sistema segue a entrega, não departamentos. Cada estágio tem ator, entradas, saídas, ferramentas e dor."
        actions={<>
          <Btn><RotateCcw className="h-3 w-3" /> Loops e exceções</Btn>
          <Btn variant="primary">Editar workflow</Btn>
        </>}
      />

      {/* Pipeline horizontal */}
      <div className="panel p-4 overflow-x-auto animate-fade-in-up">
        <div className="flex items-stretch gap-2 min-w-max">
          {STAGES.map((stage, i) => {
            const data = BACKLOG_BY_STAGE.find(b => b.stage === stage)!;
            return (
              <div key={stage} className="flex items-stretch gap-2 animate-fade-in-left" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-44 panel p-3 bg-surface-2 card-interactive group">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold transition-colors duration-300 group-hover:text-primary">Etapa {i+1}</div>
                  <div className="text-sm font-semibold mt-1">{stage}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{OWNERS_BY_STAGE[stage]}</div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <div className="text-xl font-bold tnum number-animate" style={{ animationDelay: `${i * 80 + 200}ms` }}>{data.count}</div>
                    <div className="text-[10px] text-muted-foreground">no estágio</div>
                  </div>
                  {(data.atRisk > 0 || data.breached > 0) && (
                    <div className="mt-1 text-[10px]">
                      {data.breached > 0 && <span className="text-destructive font-semibold badge-pulse">{data.breached} estourado · </span>}
                      {data.atRisk > 0 && <span className="text-warning font-semibold animate-pulse">{data.atRisk} risco</span>}
                    </div>
                  )}
                </div>
                {i < STAGES.length - 1 && (
                  <div className="flex flex-col items-center justify-center text-muted-foreground animate-fade-in" style={{ animationDelay: `${i * 80 + 100}ms` }}>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-1 hover:text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground italic flex items-center gap-2">
          <RotateCcw className="h-3 w-3" /> O fluxo real tem loops: do Monitoramento volta para Atendimento (reagendar) ou para Armazém (troca remessa). Do Armazém volta para Atendimento (OS errada).
        </div>
      </div>

      {/* Detalhamento por estágio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {STAGES.map((stage, i) => {
          const d = STAGE_DETAIL[stage];
          return (
            <div 
              key={stage} 
              className="panel p-4 card-interactive"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{stage}</div>
                  <div className="text-sm font-semibold mt-0.5">{d.actor}</div>
                </div>
                <span className="chip bg-surface-2 text-muted-foreground border-border transition-all duration-300 hover:border-primary/30 hover:text-primary">handoff</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-[11px]">
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Entradas</div>
                  <ul className="space-y-0.5">{d.inputs.map((x, j) => <li key={x} className="flex items-start gap-1 animate-fade-in-left" style={{ animationDelay: `${i * 100 + j * 30}ms` }}><span className="text-primary">·</span>{x}</li>)}</ul>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Saídas</div>
                  <ul className="space-y-0.5">{d.outputs.map((x, j) => <li key={x} className="flex items-start gap-1 animate-fade-in-right" style={{ animationDelay: `${i * 100 + j * 30}ms` }}><CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />{x}</li>)}</ul>
                </div>
              </div>
              <div className="mt-3 text-[11px]">
                <div className="text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Ferramentas</div>
                <div className="flex flex-wrap gap-1">{d.tools.map((t, j) => <span key={t} className="chip bg-surface-2 text-muted-foreground border-border text-[10px] transition-all duration-200 hover:border-primary/30 hover:scale-105" style={{ animationDelay: `${j * 40}ms` }}>{t}</span>)}</div>
              </div>
              <div className="mt-3 p-2 rounded bg-warning/5 border border-warning/20 text-[11px] flex items-start gap-2 hover-glow">
                <AlertTriangle className="h-3 w-3 text-warning shrink-0 mt-0.5 animate-pulse" />
                <span><span className="text-warning font-semibold">Dor real hoje:</span> {d.pain}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
