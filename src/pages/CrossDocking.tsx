import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { ORDERS } from "@/data/mock";
import { Boxes, ScanLine, Truck, CheckCircle2, Package, Layers, Box } from "lucide-react";

export default function CrossDocking() {
  const queue = ORDERS.filter(o => o.status === "awaiting_separation").slice(0, 12);
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Cross docking · Barueri/SP"
        subtitle="Operações de armazém · separação, alocação de equipamento e prontidão para despacho"
        actions={<><Filters items={["Onda 1","Onda 2","Onda 3","Todas"]}/><Btn variant="primary"><ScanLine className="h-3 w-3"/> Bipar serial</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Em separação", v: 142, i: Layers, t: "primary" },
          { l: "Equipamentos prontos", v: 89, i: Box, t: "info" },
          { l: "Carregados na doca", v: 22, i: Truck, t: "warning" },
          { l: "Despachados hoje", v: 318, i: CheckCircle2, t: "success" },
        ].map(s => (
          <div key={s.l} className="panel p-4">
            <div className="flex items-center justify-between">
              <div className="stat-label">{s.l}</div>
              <s.i className={`h-3.5 w-3.5 text-${s.t}`} style={{color: `hsl(var(--${s.t}))`}}/>
            </div>
            <div className="stat-value mt-2">{s.v}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Onda 2 · corte 14:00</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Separation Kanban */}
        <div className="col-span-12 xl:col-span-8 grid grid-cols-3 gap-3">
          {[
            { name: "Aguardando separação", color: "warning", items: queue.slice(0, 4) },
            { name: "Picking em andamento", color: "info", items: queue.slice(4, 8) },
            { name: "Pronto para despacho", color: "success", items: queue.slice(8, 12) },
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
                      <span className="text-[10px] text-muted-foreground">SN ···{o.serial?.slice(-4)}</span>
                    </div>
                    <div className="text-xs font-semibold mt-1 truncate">{o.equipment}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{o.client} · {o.destination}</div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="chip text-[9px] bg-surface-3 border-border text-muted-foreground"><Package className="h-2.5 w-2.5"/>1 unid.</span>
                      <span className="chip text-[9px] border-border text-muted-foreground">A-04-12</span>
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
            <div className="text-sm font-semibold flex items-center gap-2"><Boxes className="h-3.5 w-3.5"/> Disponibilidade de equipamentos</div>
            <Btn variant="ghost">Estoque</Btn>
          </div>
          <div className="p-4 space-y-3">
            {[
              { sku: "ONT Huawei HG8245", on: 412, allocated: 182, low: false },
              { sku: "Roteador WiFi 6 AX1800", on: 96, allocated: 84, low: true },
              { sku: "Decoder 4K", on: 248, allocated: 110, low: false },
              { sku: "Switch 24P PoE", on: 18, allocated: 14, low: true },
              { sku: "Modem DOCSIS 3.1", on: 322, allocated: 76, low: false },
              { sku: "ONU Nokia G-140W", on: 58, allocated: 51, low: true },
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
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            {["Recebimento","Triagem","Picking","Conferência","Carregamento","Despacho"].map((s, i, arr) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Etapa {i+1}</div>
                  <div className="text-sm font-semibold mt-0.5">{s}</div>
                  <div className="text-[11px] text-muted-foreground tnum">{[88,72,142,55,22,318][i]} unidades</div>
                  <div className="mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${[100,90,70,50,40,90][i]}%` }}/>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="w-6 h-px bg-border"/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
