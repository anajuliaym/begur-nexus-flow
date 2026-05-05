import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELIVERIES, STAGE_META, DeliveryStage, TYPE_LABELS } from "@/data/mock";
import { 
  Package, MapPin, Clock, CheckCircle2, Search, Truck,
  MessageSquare, Star, ArrowLeft, ChevronRight,
  Plus, FileText, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import begurLogo from "@/assets/begur-logo.png";

type PortalView = "dashboard" | "tracking" | "new" | "history";

// Simulated client data
const CLIENT_NAME = "Heineken";
const clientDeliveries = DELIVERIES.filter(d => d.client === CLIENT_NAME || d.client === "Heineken");

const TRACKING_STEPS = [
  { label: "Solicitação recebida", time: "08:12", done: true },
  { label: "Cross-docking / Análise de frete", time: "09:30", done: true },
  { label: "Saiu para entrega", time: "11:00", done: true },
  { label: "Entregue", time: "—", done: false },
];

export default function ClientePortal() {
  const navigate = useNavigate();
  const [view, setView] = useState<PortalView>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selected = DELIVERIES.find(d => d.id === selectedId);
  const active = clientDeliveries.filter(d => d.stage !== "concluida");
  const completed = clientDeliveries.filter(d => d.stage === "concluida");

  // Tracking detail
  if (view === "tracking" && selected) {
    const currentStep = selected.stage === "solicitacao" ? 0 : selected.stage === "crossdocking" ? 1 : selected.stage === "execucao" ? 2 : 3;
    
    return (
      <div className="max-w-[900px] mx-auto p-6 space-y-6">
        {/* Branding header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
            <img src={begurLogo} alt="Begur" className="h-5 brightness-0 invert" />
          </div>
          <div>
            <span className="text-sm font-bold">Begur</span>
            <span className="text-[10px] text-muted-foreground ml-1">Portal do Cliente</span>
          </div>
        </div>

        <button onClick={() => { setView("dashboard"); setSelectedId(null); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {/* Status header */}
        <div className="panel p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                <span className={cn("chip text-[10px]", STAGE_META[selected.stage].color)}>{STAGE_META[selected.stage].label}</span>
              </div>
              <h2 className="text-xl font-semibold">Rastreamento da entrega</h2>
              <p className="text-sm text-muted-foreground mt-1">{TYPE_LABELS[selected.type]} · {selected.items.map(it => `${it.qty}× ${it.name}`).join(", ")}</p>
            </div>
            {selected.eta && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Previsão</div>
                <div className="text-2xl font-bold text-primary tnum">{selected.eta}</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Timeline tracking */}
          <div className="col-span-7">
            <div className="panel p-6">
              <h3 className="text-sm font-semibold mb-6">Progresso da entrega</h3>
              <ol className="space-y-0">
                {TRACKING_STEPS.map((step, i) => {
                  const isDone = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <li key={i} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2",
                          isDone
                            ? isCurrent
                              ? "bg-primary text-primary-foreground border-primary shadow-glow"
                              : "bg-success text-success-foreground border-success"
                            : "bg-card text-muted-foreground border-border"
                        )}>
                          {isDone && !isCurrent ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        {i < TRACKING_STEPS.length - 1 && (
                          <div className={cn("w-0.5 h-12 -mt-0", isDone && i < currentStep ? "bg-success" : "bg-border")} />
                        )}
                      </div>
                      <div className="pt-2 pb-6">
                        <div className={cn("text-sm font-medium", isDone ? "text-foreground" : "text-muted-foreground")}>{step.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{step.time}</div>
                        {isCurrent && selected.stage === "execucao" && (
                          <div className="mt-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-xs text-primary font-medium">🚛 Motorista a caminho — {selected.driver}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Info sidebar */}
          <div className="col-span-5 space-y-4">
            <div className="panel p-5 space-y-3">
              <h3 className="text-sm font-semibold">Detalhes da entrega</h3>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Origem</div>
                <div className="text-sm">{selected.origin}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Destino</div>
                <div className="text-sm flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />{selected.destination}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">SLA</div>
                <div className="text-sm">{selected.sla}</div>
              </div>
            </div>

            <div className="panel p-5 space-y-3">
              <h3 className="text-sm font-semibold">Itens</h3>
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Package className="h-3.5 w-3.5 text-muted-foreground" />{item.name}</span>
                  <span className="font-semibold tnum">{item.qty}×</span>
                </div>
              ))}
            </div>

            {selected.driver && (
              <div className="panel p-5 space-y-2">
                <h3 className="text-sm font-semibold">Motorista</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{selected.driver}</div>
                    <div className="text-xs text-muted-foreground">{selected.driverPhone}</div>
                  </div>
                </div>
              </div>
            )}

            {selected.stage === "concluida" && (
              <div className="panel p-5 border-success/30">
                <h3 className="text-sm font-semibold text-success mb-3">Confirmar recebimento</h3>
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={cn("h-6 w-6 cursor-pointer", s <= 4 ? "text-warning fill-warning" : "text-muted-foreground")} />
                    ))}
                  </div>
                  <textarea placeholder="Deixe um comentário sobre a entrega…" rows={2} className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button className="w-full h-10 rounded-xl bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition">
                    Enviar feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // New request
  if (view === "new") {
    return (
      <div className="max-w-[700px] mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
            <img src={begurLogo} alt="Begur" className="h-5 brightness-0 invert" />
          </div>
          <div>
            <span className="text-sm font-bold">Begur</span>
            <span className="text-[10px] text-muted-foreground ml-1">Portal do Cliente</span>
          </div>
        </div>

        <button onClick={() => setView("dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="panel">
          <div className="panel-header">
            <span className="text-sm font-semibold">Nova solicitação de entrega</span>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                <select className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option>Entrega</option>
                  <option>Coleta</option>
                  <option>Reentrega</option>
                  <option>Remessa</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Prioridade</label>
                <select className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option>Normal</option>
                  <option>Urgente (SLA 4h)</option>
                  <option>Expressa (Mesmo dia)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Endereço de destino</label>
              <input placeholder="Rua, número — Cidade/UF" className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Itens</label>
              <textarea placeholder="Descreva os itens e quantidades…" rows={3} className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Observações</label>
              <textarea placeholder="Instruções especiais, janela de entrega…" rows={2} className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setView("dashboard")} className="h-10 px-5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition">Cancelar</button>
              <button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Enviar solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="max-w-[1000px] mx-auto p-6 space-y-6">
      {/* Client header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
            <img src={begurLogo} alt="Begur" className="h-5 brightness-0 invert" />
          </div>
          <div>
            <span className="text-sm font-bold">Begur</span>
            <span className="text-[10px] text-muted-foreground ml-1">Portal do Cliente</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="h-8 px-3 rounded-xl border border-border text-xs font-medium hover:bg-accent transition flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Mesa do Analista
          </button>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-8 rounded-xl bg-primary/10 grid place-items-center text-[11px] font-bold text-primary">HK</div>
            <span className="font-medium">{CLIENT_NAME}</span>
          </div>
          <button className="h-8 px-3 rounded-xl border border-border text-xs font-medium hover:bg-accent transition flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" /> Ajuda
          </button>
        </div>
      </div>

      {/* Welcome + CTA */}
      <div className="panel bg-gradient-primary p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary-foreground">Bem-vindo ao portal Begur</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">Acompanhe suas entregas em tempo real</p>
          </div>
          <button onClick={() => setView("new")} className="h-11 px-5 rounded-2xl bg-white text-secondary font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-white/90 transition">
            <Plus className="h-4 w-4" /> Nova solicitação
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="panel p-4 text-center">
          <div className="text-2xl font-bold text-primary tnum">{active.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Em andamento</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="text-2xl font-bold text-success tnum">{completed.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Concluídas</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="text-2xl font-bold text-warning tnum">{active.filter(d => d.slaStatus !== "on_track").length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Em risco</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="text-2xl font-bold tnum">98.8%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">OTIF</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar entrega por ID…"
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Active deliveries */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Entregas em andamento</h2>
        <div className="panel">
          <div className="divide-y divide-border">
            {active.map(d => (
              <button
                key={d.id}
                onClick={() => { setSelectedId(d.id); setView("tracking"); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-accent/40 transition text-left"
              >
                <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0",
                  d.stage === "execucao" ? "bg-primary/10" : "bg-warning/10"
                )}>
                  {d.stage === "execucao" ? <Truck className="h-5 w-5 text-primary" /> : <Package className="h-5 w-5 text-warning" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                    <span className={cn("chip text-[10px]", STAGE_META[d.stage].color)}>{STAGE_META[d.stage].label}</span>
                  </div>
                  <p className="text-sm mt-0.5">{d.items.map(it => `${it.qty}× ${it.name}`).join(", ")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.destination}</p>
                </div>
                <div className="text-right shrink-0">
                  {d.eta && <div className="text-sm font-semibold text-primary tnum">ETA {d.eta}</div>}
                  <div className="text-xs text-muted-foreground">{d.created}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
            {active.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma entrega em andamento.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent completed */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Entregas recentes</h2>
        <div className="panel">
          <div className="divide-y divide-border">
            {completed.slice(0, 5).map(d => (
              <button
                key={d.id}
                onClick={() => { setSelectedId(d.id); setView("tracking"); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-accent/40 transition text-left"
              >
                <div className="h-10 w-10 rounded-xl bg-success/10 grid place-items-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                    <span className="chip text-[10px] bg-success/10 text-success border-success/30">Concluída</span>
                  </div>
                  <p className="text-sm mt-0.5 truncate">{d.items.map(it => `${it.qty}× ${it.name}`).join(", ")}</p>
                </div>
                <div className="text-xs text-muted-foreground">{d.created}</div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
