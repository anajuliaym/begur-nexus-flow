import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { ORDERS } from "@/data/mock";
import { Boxes, ScanLine, Truck, CheckCircle2, Package, Layers, Box, FileText, Snowflake, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CrossDocking() {
  const queue = ORDERS.filter(o => ["awaiting_picking","picking","awaiting_conference"].includes(o.status)).slice(0, 12);
  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Workspace Armazém / Cross-dock · CD Barueri/SP"
        subtitle="Separação por SKU, bipagem de serial quando exigido, conferência manual e romaneio. Tem digital e tem papel — ambos aparecem aqui."
        actions={<><Filters items={["Onda 1","Onda 2","Onda 3","Todas"]}/><Btn variant="primary"><ScanLine className="h-3 w-3"/> Bipar serial</Btn></>}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: "Em separação", v: 142, i: Layers, t: "primary" },
          { l: "Conferência manual", v: 38, i: CheckCircle2, t: "warning", note: "papel + bipagem" },
          { l: "Aguardando carga", v: 22, i: Truck, t: "warning" },
          { l: "Despachados hoje", v: 318, i: CheckCircle2, t: "success" },
          { l: "Câmara fria ocupada", v: "78%", i: Snowflake, t: "info", note: "−2°C estável" },
        ].map(s => (
          <div key={s.l} className="panel p-4">
            <div className="flex items-center justify-between">
              <div className="stat-label">{s.l}</div>
              <s.i className="h-3.5 w-3.5" style={{color: `hsl(var(--${s.t}))`}}/>
            </div>
            <div className="stat-value mt-2">{s.v}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{s.note ?? "Onda 2 · corte 14:00"}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Separation Kanban */}
        <div className="col-span-12 xl:col-span-8 grid grid-cols-3 gap-3">
          {[
            { name: "Aguardando separação", color: "warning", items: queue.slice(0, 4) },
            { name: "Em separação", color: "info", items: queue.slice(4, 8) },
            { name: "Conferência / pronto p/ doca", color: "success", items: queue.slice(8, 12) },
          ].map(col => (
            <div key={col.name} className="panel flex flex-col">
              <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(var(--${col.color}))` }}/>
                  <div className="text-xs font-semibold">{col.name}</div>
                </div>
                <span className="text-[10px] text-muted-foreground tnum">{col.items.length}</span>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto">
                {col.items.map(o => (
                  <div key={o.id} className="rounded-md border border-border bg-surface-1 p-2.5 hover:bg-surface-2 cursor-grab">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-[10px] text-primary">{o.id}</div>
                      {o.serialRequired
                        ? <span className="chip text-[9px] bg-warning/10 text-warning border-warning/30">SN obrigatório</span>
                        : <span className="text-[10px] text-muted-foreground">sem serial</span>}
                    </div>
                    <div className="text-xs font-semibold mt-1 truncate" title={o.cargo}>{o.cargo}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{o.client} · {o.qty} {o.unit}</div>
                    <div className="text-[10px] text-muted-foreground truncate">→ {o.destination}</div>
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                      <span className={cn("chip text-[9px] border-border",
                        o.temperature === "congelado" ? "bg-info/10 text-info border-info/30" :
                        o.temperature === "refrigerado" ? "bg-primary/10 text-primary border-primary/30" :
                        "bg-surface-3 text-muted-foreground"
                      )}>
                        <Thermometer className="h-2.5 w-2.5"/>{o.temperature}
                      </span>
                      <span className="chip text-[9px] border-border text-muted-foreground">A-04-12</span>
                      {o.hasPhysicalDoc && <span className="chip text-[9px] bg-warning/10 text-warning border-warning/30"><FileText className="h-2.5 w-2.5"/>NF papel</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Equipment availability */}
        <div className="col-span-12 xl:col-span-4 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><Boxes className="h-3.5 w-3.5"/> Estoque por SKU</div>
            <Btn variant="ghost">Ver tudo</Btn>
          </div>
          <div className="p-4 space-y-3">
            {[
              { sku: "Heineken Long Neck 330ml — fardo 24un", on: 1820, allocated: 642, low: false },
              { sku: "Bacio Pote 500ml — pallet mix", on: 96, allocated: 84, low: true },
              { sku: "Nestlé KitKat display PDV", on: 248, allocated: 110, low: false },
              { sku: "Freezer Metalfrio HC-503", on: 18, allocated: 14, low: true },
              { sku: "Suco Natural One 900ml — fardo", on: 322, allocated: 76, low: false },
              { sku: "Visa-cooler Solar 4 portas", on: 12, allocated: 11, low: true },
            ].map(s => {
              const free = s.on - s.allocated;
              const pct = (s.allocated / s.on) * 100;
              return (
                <div key={s.sku}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate">{s.sku}</span>
                    <span className={`tnum ${s.low ? "text-warning" : "text-muted-foreground"}`}>{free} livres</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, background: s.low ? "hsl(var(--warning))" : "hsl(var(--primary))" }}/>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.allocated} alocados · {s.on} em estoque</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dock workflow */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold flex items-center gap-2"><Truck className="h-3.5 w-3.5"/> Fluxo da doca · hoje</div>
          <div className="text-[11px] text-muted-foreground">Romaneio impresso ainda é o gatilho oficial de liberação (Fase 1: digitalizar)</div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            {["Recebimento NF","Triagem","Picking","Conferência manual","Romaneio impresso","Carregamento","Despacho"].map((s, i, arr) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Etapa {i+1}</div>
                  <div className="text-sm font-semibold mt-0.5">{s}</div>
                  <div className="text-[11px] text-muted-foreground tnum">{[88,72,142,55,42,22,318][i]} unidades</div>
                  <div className="mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${[100,90,70,55,45,40,90][i]}%` }}/>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="w-4 h-px bg-border"/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
