import { useState } from "react";
import { PageHeader, Btn, Filters, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { ORDERS, STATUS_META } from "@/data/mock";
import { Plus, Download, MoreHorizontal, Mail, MessageSquare, Globe, Layout, Edit3, Paperclip, FileText, Plug } from "lucide-react";

const CHANNEL_ICON: any = { Email: Mail, WhatsApp: MessageSquare, "API/Lincros": Plug, Portal: Layout, Manual: Edit3, "NF Física": FileText };

export default function Orders() {
  const [tab, setTab] = useState<string>("all");
  const counts = Object.entries(STATUS_META).map(([k, v]) => ({ k, v, c: ORDERS.filter(o => o.status === k).length }));
  const filtered = tab === "all" ? ORDERS : ORDERS.filter(o => o.status === tab);

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Pedidos"
        subtitle={`Gestão de ciclo de vida completo · ${ORDERS.length} pedidos exibidos de 1.284 totais`}
        actions={<>
          <Btn variant="outline"><Download className="h-3 w-3"/> Exportar</Btn>
          <Btn variant="primary"><Plus className="h-3 w-3"/> Novo pedido</Btn>
        </>}
      />

      {/* Status pills com contagem por estágio do workflow */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button onClick={() => setTab("all")}
          className={`px-3 h-8 rounded-md text-xs font-medium border whitespace-nowrap ${tab==="all" ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"}`}>
          Todos <span className="ml-1.5 tnum opacity-70">{ORDERS.length}</span>
        </button>
        {counts.map(({ k, v, c }) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-3 h-8 rounded-md text-xs font-medium border whitespace-nowrap ${tab===k ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {v.label} <span className="ml-1.5 tnum opacity-70">{c}</span>
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <Filters items={["Todos os clientes","Heineken","Nestlé","Seara","Froneri","Bacio","Solar","Metalfrio","Natural One"]} />
          <div className="flex gap-1.5">
            <Btn variant="outline">Ações em massa</Btn>
            <Btn variant="ghost"><MoreHorizontal className="h-3 w-3"/></Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border bg-surface-1/50 sticky top-0">
              <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                <th><input type="checkbox" className="accent-primary"/></th>
                <th>Pedido</th><th>Cliente</th><th>Canal</th><th>Carga</th>
                <th>Destino</th><th>Motorista</th><th>ETA</th><th>SLA</th><th>Status</th><th>Valor</th><th>Criado</th><th></th>
              </tr>
            </thead>
            <tbody className="tnum">
              {filtered.slice(0, 30).map(o => {
                const Ch = CHANNEL_ICON[o.channel] ?? Edit3;
                return (
                  <tr key={o.id} className="border-b border-border row-hover">
                    <td className="px-3 py-2.5"><input type="checkbox" className="accent-primary"/></td>
                    <td className="px-3 py-2.5">
                      <div className="font-mono text-[11px] text-primary">{o.id}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {o.serialRequired && <><Paperclip className="h-2.5 w-2.5"/>requer SN</>}
                        {o.hasPhysicalDoc && <span className="text-warning ml-1">📄 NF física</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium">{o.client}</td>
                    <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 text-muted-foreground"><Ch className="h-3 w-3"/>{o.channel}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[180px]" title={o.cargo}>{o.qty} {o.unit} · {o.cargo}</td>
                    <td className="px-3 py-2.5">{o.destination}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{o.driver ?? "—"}</td>
                    <td className="px-3 py-2.5">{o.eta}</td>
                    <td className="px-3 py-2.5"><SlaBadge sla={o.sla}/></td>
                    <td className="px-3 py-2.5"><StatusBadge status={o.status}/></td>
                    <td className="px-3 py-2.5">R$ {o.value.toLocaleString("pt-BR")}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{o.created}</td>
                    <td className="px-3 py-2.5"><Btn variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal className="h-3 w-3"/></Btn></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Exibindo 1–30 de {filtered.length}</span>
          <div className="flex gap-1">
            <Btn variant="outline">Anterior</Btn>
            <Btn variant="outline">Próxima</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
