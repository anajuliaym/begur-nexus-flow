import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELIVERIES, STAGE_META, DeliveryStage } from "@/data/mock";
import { 
  Package, MapPin, Clock, CheckCircle2, AlertTriangle, Phone, 
  Camera, Navigation, MessageSquare, Truck, XCircle, ChevronRight,
  Menu, Bell, User, ChevronUp, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

type DriverView = "list" | "detail" | "navigation";

const driverDeliveries = DELIVERIES.filter(d => d.driver === "Carlos Mendes" && d.stage === "execucao")
  .concat(DELIVERIES.filter(d => d.driver === "Carlos Mendes" && d.stage === "preparacao").slice(0, 2));

export default function EntregadorApp() {
  const navigate = useNavigate();
  const [view, setView] = useState<DriverView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completedStops, setCompletedStops] = useState<Set<string>>(new Set());

  const selected = DELIVERIES.find(d => d.id === selectedId);

  // Navigation view
  if (view === "navigation" && selected) {
    return (
      <div className="max-w-[400px] mx-auto bg-background min-h-screen flex flex-col">
        {/* Map placeholder */}
        <div className="relative h-[300px] bg-gradient-to-b from-secondary to-secondary/80 flex items-center justify-center">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button onClick={() => setView("detail")} className="h-10 w-10 rounded-2xl bg-card/90 backdrop-blur grid place-items-center shadow-lg">
              <ChevronUp className="h-5 w-5" />
            </button>
            <div className="bg-card/90 backdrop-blur rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-xs font-semibold">ETA {selected.eta || "15:30"}</span>
            </div>
          </div>
          <div className="text-center text-primary-foreground/60">
            <Navigation className="h-12 w-12 mx-auto mb-2 text-primary" />
            <p className="text-xs">Navegação ativa</p>
            <p className="text-lg font-bold text-primary-foreground mt-1">4.2 km restantes</p>
          </div>
        </div>

        {/* Destination card */}
        <div className="flex-1 p-4 space-y-4">
          <div className="panel p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{selected.client}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{selected.destination}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="panel p-4 flex flex-col items-center gap-2 hover:bg-accent/30 transition">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Ligar</span>
            </button>
            <button className="panel p-4 flex flex-col items-center gap-2 hover:bg-accent/30 transition">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Mensagem</span>
            </button>
          </div>

          <button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:bg-primary/90 transition">
            <CheckCircle2 className="h-5 w-5" /> Cheguei no local
          </button>
        </div>
      </div>
    );
  }

  // Detail view
  if (view === "detail" && selected) {
    return (
      <div className="max-w-[400px] mx-auto bg-background min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => { setView("list"); setSelectedId(null); }} className="h-9 w-9 rounded-xl border border-border grid place-items-center">
            <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
          </button>
          <div className="flex-1">
            <div className="text-sm font-semibold">{selected.id}</div>
            <div className="text-xs text-muted-foreground">{selected.client}</div>
          </div>
          <span className={cn("chip text-[10px]", STAGE_META[selected.stage].color)}>{STAGE_META[selected.stage].label}</span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Destination */}
          <div className="panel p-4">
            <div className="stat-label mb-2">Destino</div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{selected.destination}</p>
            </div>
            {selected.eta && (
              <div className="mt-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Previsão: <span className="font-semibold text-primary">{selected.eta}</span></span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="panel">
            <div className="panel-header">
              <span className="text-xs font-semibold">Itens para entrega</span>
              <span className="text-[10px] text-muted-foreground">{selected.items.length} itens</span>
            </div>
            <div className="divide-y divide-border">
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold tnum">{item.qty}×</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="panel p-4">
            <div className="stat-label mb-2">Contato do destinatário</div>
            <p className="text-sm">{selected.clientContact}</p>
          </div>

          {/* SLA info */}
          <div className="panel p-4 flex items-center justify-between">
            <div>
              <div className="stat-label">SLA</div>
              <div className="text-sm font-semibold mt-0.5">{selected.sla}</div>
            </div>
            <div className={cn("chip", 
              selected.slaStatus === "on_track" ? "bg-success/10 text-success border-success/30" :
              selected.slaStatus === "at_risk" ? "bg-warning/10 text-warning border-warning/30" :
              "bg-destructive/10 text-destructive border-destructive/30"
            )}>
              {selected.slaStatus === "on_track" ? "No prazo" : selected.slaStatus === "at_risk" ? "Em risco" : "Atrasado"}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t border-border bg-card space-y-2.5">
          <button 
            onClick={() => setView("navigation")} 
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:bg-primary/90 transition"
          >
            <Navigation className="h-4.5 w-4.5" /> Iniciar navegação
          </button>
          <div className="grid grid-cols-3 gap-2">
            <button className="h-11 rounded-xl border border-border flex items-center justify-center gap-1.5 text-xs font-medium hover:bg-accent/30 transition">
              <Camera className="h-3.5 w-3.5" /> Foto
            </button>
            <button className="h-11 rounded-xl border border-border flex items-center justify-center gap-1.5 text-xs font-medium hover:bg-accent/30 transition">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Problema
            </button>
            <button className="h-11 rounded-xl border border-border flex items-center justify-center gap-1.5 text-xs font-medium hover:bg-accent/30 transition">
              <XCircle className="h-3.5 w-3.5 text-destructive" /> Recusa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-[400px] mx-auto bg-background min-h-screen flex flex-col">
      {/* Mobile header */}
      <div className="bg-gradient-primary px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground transition text-xs font-medium">
            <ArrowLeft className="h-4 w-4" /> Mesa do Analista
          </button>
          <div className="relative">
            <Bell className="h-5 w-5 text-primary-foreground/70" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground grid place-items-center">2</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary-foreground">Olá, Carlos 👋</h1>
            <p className="text-xs text-primary-foreground/70">Motorista · Placa FGH-4521</p>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 px-4 -mt-4">
        <div className="panel p-3 text-center">
          <div className="text-lg font-bold text-primary tnum">{driverDeliveries.length}</div>
          <div className="text-[10px] text-muted-foreground">Pendentes</div>
        </div>
        <div className="panel p-3 text-center">
          <div className="text-lg font-bold text-success tnum">{completedStops.size}</div>
          <div className="text-[10px] text-muted-foreground">Concluídas</div>
        </div>
        <div className="panel p-3 text-center">
          <div className="text-lg font-bold text-warning tnum">0</div>
          <div className="text-[10px] text-muted-foreground">Ocorrências</div>
        </div>
      </div>

      {/* Deliveries */}
      <div className="flex-1 overflow-auto px-4 pt-5 pb-4 space-y-3">
        <h2 className="text-sm font-semibold">Roteiro do dia</h2>
        {driverDeliveries.map((d, i) => {
          const done = completedStops.has(d.id);
          return (
            <button
              key={d.id}
              onClick={() => { setSelectedId(d.id); setView("detail"); }}
              className={cn("w-full panel p-4 text-left transition", done && "opacity-50")}
            >
              <div className="flex items-start gap-3">
                <div className={cn("h-8 w-8 rounded-xl grid place-items-center shrink-0 text-xs font-bold",
                  done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                )}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{d.client}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{d.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.destination}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" />{d.items.length} itens
                    </span>
                    {d.eta && (
                      <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />ETA {d.eta}
                      </span>
                    )}
                    <span className={cn("text-[10px] font-medium",
                      d.slaStatus === "on_track" ? "text-success" : d.slaStatus === "at_risk" ? "text-warning" : "text-destructive"
                    )}>
                      SLA {d.sla}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Truck className="h-5 w-5" />
          <span className="text-[10px] font-medium">Entregas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <Navigation className="h-5 w-5" />
          <span className="text-[10px] font-medium">Rota</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-[10px] font-medium">Ocorrências</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
}
