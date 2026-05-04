import { useParams, useNavigate } from "react-router-dom";
import { DELIVERIES, STAGE_META, TYPE_LABELS, DeliveryStage } from "@/data/mock";
import { Btn, SlaBadge } from "@/components/ui-kit";
import { ArrowLeft, Package, MapPin, User, Phone, Clock, CheckCircle2, AlertTriangle, Truck, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const WORKFLOW_STAGES: { key: DeliveryStage; label: string; icon: any }[] = [
  { key: "solicitacao", label: "Solicitação", icon: FileText },
  { key: "preparacao", label: "Preparação", icon: Package },
  { key: "execucao", label: "Execução", icon: Truck },
  { key: "retorno", label: "Retorno", icon: MessageSquare },
  { key: "concluida", label: "Concluída", icon: CheckCircle2 },
];

function stageIndex(stage: DeliveryStage) {
  return WORKFLOW_STAGES.findIndex(s => s.key === stage);
}

export default function EntregaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const delivery = DELIVERIES.find(d => d.id === id);

  if (!delivery) {
    return (
      <div className="p-6">
        <Btn variant="ghost" onClick={() => navigate("/entregas")}><ArrowLeft className="h-4 w-4"/> Voltar</Btn>
        <p className="mt-8 text-center text-muted-foreground">Entrega não encontrada.</p>
      </div>
    );
  }

  const currentIdx = stageIndex(delivery.stage);

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/entregas")} className="h-9 w-9 rounded-xl border border-border grid place-items-center hover:bg-accent transition">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{delivery.id}</h1>
            <span className={cn("chip", STAGE_META[delivery.stage].color)}>{STAGE_META[delivery.stage].label}</span>
            <span className="chip bg-surface-2 border-border text-muted-foreground text-xs">{TYPE_LABELS[delivery.type]}</span>
            <SlaBadge sla={delivery.slaStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{delivery.client} · Criado {delivery.created}</p>
        </div>
        <div className="flex gap-2">
          {delivery.stage === "solicitacao" && <Btn variant="primary">Avançar para Preparação</Btn>}
          {delivery.stage === "preparacao" && <Btn variant="primary">Despachar</Btn>}
          {delivery.stage === "retorno" && <Btn variant="primary">Tratar exceção</Btn>}
          {delivery.stage === "execucao" && <Btn variant="outline">Registrar ocorrência</Btn>}
        </div>
      </div>

      {/* Workflow pipeline */}
      <div className="panel p-5">
        <div className="flex items-center justify-between">
          {WORKFLOW_STAGES.map((ws, i) => {
            const Icon = ws.icon;
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={ws.key} className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  isDone ? "bg-success text-success-foreground" :
                  isCurrent ? "bg-primary text-primary-foreground shadow-glow" :
                  "bg-muted text-muted-foreground"
                )}>
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-xs font-semibold", isCurrent ? "text-primary" : isDone ? "text-success" : "text-muted-foreground")}>
                    {ws.label}
                  </div>
                </div>
                {i < WORKFLOW_STAGES.length - 1 && (
                  <div className={cn("h-0.5 w-8 rounded-full shrink-0", i < currentIdx ? "bg-success" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Main content */}
        <div className="col-span-8 space-y-5">
          {/* Timeline */}
          <div className="panel">
            <div className="panel-header">
              <span className="text-sm font-semibold">Linha do tempo</span>
            </div>
            <div className="p-5">
              <ol className="relative border-l-2 border-border ml-4 space-y-6">
                {delivery.timeline.map((evt, i) => {
                  const colors: Record<string, string> = {
                    system: "bg-info", driver: "bg-primary", analyst: "bg-success", client: "bg-warning", exception: "bg-destructive",
                  };
                  return (
                    <li key={i} className="ml-6 relative">
                      <div className={cn("absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-card", colors[evt.type])} />
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{evt.time}</span>
                        <span className="text-sm font-medium">{evt.title}</span>
                      </div>
                      {evt.description && <p className="text-xs text-muted-foreground mt-0.5">{evt.description}</p>}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Items */}
          <div className="panel">
            <div className="panel-header">
              <span className="text-sm font-semibold">Itens</span>
            </div>
            <div className="divide-y divide-border">
              {delivery.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium tnum">{item.qty}×</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback (if concluded) */}
          {delivery.feedback && (
            <div className="panel border-success/30 bg-success/5">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold text-success">Feedback do cliente</span>
                </div>
                <p className="text-sm text-foreground">{delivery.feedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="col-span-4 space-y-4">
          {/* Delivery info card */}
          <div className="panel p-5 space-y-4">
            <h3 className="text-sm font-semibold">Informações</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Origem</div>
                  <div className="text-sm">{delivery.origin}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Destino</div>
                  <div className="text-sm">{delivery.destination}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">SLA</div>
                  <div className="text-sm">{delivery.sla}</div>
                </div>
              </div>
              {delivery.eta && (
                <div className="flex items-start gap-3">
                  <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Previsão</div>
                    <div className="text-sm font-medium text-primary">{delivery.eta}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Driver */}
          {delivery.driver && (
            <div className="panel p-5 space-y-3">
              <h3 className="text-sm font-semibold">Motorista</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{delivery.driver}</div>
                  {delivery.driverPhone && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/>{delivery.driverPhone}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Client */}
          <div className="panel p-5 space-y-3">
            <h3 className="text-sm font-semibold">Cliente</h3>
            <div className="text-sm font-medium">{delivery.client}</div>
            <div className="text-xs text-muted-foreground">{delivery.clientContact}</div>
            {delivery.recipientName && (
              <div className="text-xs text-muted-foreground">Recebido por: <span className="text-foreground font-medium">{delivery.recipientName}</span></div>
            )}
          </div>

          {/* Value */}
          <div className="panel p-5">
            <div className="stat-label">Valor</div>
            <div className="text-xl font-semibold mt-1 tnum">R$ {delivery.value.toLocaleString("pt-BR")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
