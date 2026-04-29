import { PageHeader } from "@/components/ui-kit";
import { Smartphone, MapPin, Camera, AlertTriangle, CheckCircle2, Clock, Navigation, Phone, FileSignature } from "lucide-react";
import { cn } from "@/lib/utils";

const STOPS = [
  { seq: 1, name: "PDV Pão de Açúcar — Vila Olímpia", addr: "R. Olimpíadas, 205 · São Paulo/SP", cargo: "8 chopeiras Heineken Sub 30L", status: "delivered", time: "07:42" },
  { seq: 2, name: "Bar Amarelinho — Centro", addr: "Av. Brig. Faria Lima, 1230 · São Paulo/SP", cargo: "20 fardos Heineken LN 330ml", status: "in_progress", time: "—" },
  { seq: 3, name: "Restaurante Fasano", addr: "R. Vittorio Fasano, 88 · São Paulo/SP", cargo: "4 visa-coolers Solar", status: "pending", time: "—" },
  { seq: 4, name: "Loja Carrefour Pinheiros", addr: "Av. das Nações Unidas, 4777 · São Paulo/SP", cargo: "Pallet Bacio sorvete mix", status: "pending", time: "—" },
  { seq: 5, name: "Loja Bacio Itaim", addr: "R. João Cachoeira, 519 · São Paulo/SP", cargo: "2 ilhas refrigeradas", status: "pending", time: "—" },
];

export default function AppMotorista() {
  return (
    <div className="p-5 space-y-4">
      <PageHeader
        title="App do Motorista — visão mobile"
        subtitle="Aceite de rota, sequência de paradas, foto de comprovante, abertura de ocorrência. Substitui o WhatsApp como canal oficial."
      />

      <div className="flex justify-center">
        {/* Mockup mobile */}
        <div className="w-[380px] panel overflow-hidden bg-card border-2 border-border" style={{ borderRadius: 28 }}>
          {/* Status bar */}
          <div className="bg-background px-5 py-2 flex items-center justify-between text-[10px] font-semibold">
            <span>09:14</span>
            <span className="font-bold">Begur Driver</span>
            <span>●●● 4G ▮</span>
          </div>

          {/* Rota header */}
          <div className="bg-gradient-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Viagem em andamento</div>
                <div className="text-base font-bold">TRP-44218 · Grande SP</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tnum">5</div>
                <div className="text-[10px] opacity-80">paradas</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px]">
              <Smartphone className="h-3 w-3" />
              <span>Truck Frigo MNT-4A12 · -2°C</span>
              <Navigation className="h-3 w-3 ml-auto" />
              <span>187 km</span>
            </div>
          </div>

          {/* Próxima parada */}
          <div className="bg-warning/10 border-b border-warning/30 px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-1">Próxima parada</div>
            <div className="text-sm font-semibold">Bar Amarelinho — Centro</div>
            <div className="text-[11px] text-muted-foreground">Av. Brig. Faria Lima, 1230</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">20 fardos Heineken LN 330ml · Janela 09h–11h</div>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              <button className="h-9 rounded bg-success text-success-foreground text-[11px] font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Cheguei
              </button>
              <button className="h-9 rounded bg-surface-2 border border-border text-[11px] font-bold flex items-center justify-center gap-1">
                <Navigation className="h-3 w-3" /> Rota
              </button>
              <button className="h-9 rounded bg-surface-2 border border-border text-[11px] font-bold flex items-center justify-center gap-1">
                <Phone className="h-3 w-3" /> Cliente
              </button>
            </div>
          </div>

          {/* Sequência */}
          <div className="max-h-[300px] overflow-y-auto">
            {STOPS.map(s => (
              <div key={s.seq} className="px-4 py-3 border-b border-border flex items-center gap-3">
                <div className={cn(
                  "h-7 w-7 rounded-full grid place-items-center text-[11px] font-bold shrink-0",
                  s.status === "delivered" ? "bg-success text-success-foreground" :
                  s.status === "in_progress" ? "bg-warning text-warning-foreground animate-pulse" :
                  "bg-surface-2 text-muted-foreground border border-border"
                )}>
                  {s.status === "delivered" ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.seq}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.cargo}</div>
                </div>
                <div className="text-[10px] text-muted-foreground tnum">{s.time}</div>
              </div>
            ))}
          </div>

          {/* Ações rápidas */}
          <div className="grid grid-cols-4 gap-px bg-border border-t border-border">
            {[
              { icon: Camera, label: "Foto canhoto", tone: "text-primary" },
              { icon: FileSignature, label: "Coletar assinatura", tone: "text-info" },
              { icon: AlertTriangle, label: "Abrir ocorrência", tone: "text-destructive" },
              { icon: Clock, label: "Espera 30min", tone: "text-warning" },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} className="bg-card py-3 flex flex-col items-center gap-1 hover:bg-accent">
                  <Icon className={cn("h-4 w-4", a.tone)} />
                  <span className="text-[9px] text-center text-muted-foreground leading-tight px-1">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tipologia de ocorrência ao lado */}
      <div className="panel p-4 max-w-[680px] mx-auto">
        <div className="text-sm font-semibold mb-2">Ocorrências disponíveis no app — tipologia real Begur</div>
        <div className="text-[11px] text-muted-foreground mb-3">
          O motorista escolhe motivo padronizado. Sistema aciona automaticamente: comunicação ao cliente, abertura na mesa de monitoramento, registro para SLA e financeiro.
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {["Espera 30 min","Recusa total","Recusa parcial","Reentrega","Endereço incorreto","Equipamento indisponível","Avaria","Troca remessa/retorno","Comprovante pendente","Não realizado","Janela perdida","Cliente ausente"].map(t => (
            <div key={t} className="text-[11px] px-2.5 py-1.5 bg-surface-2 rounded border border-border flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
