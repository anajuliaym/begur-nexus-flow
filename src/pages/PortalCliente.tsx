import { PageHeader, Btn, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { ORDERS } from "@/data/mock";
import { Plus, FileText, Upload, MessageSquare, Building2, CheckCircle2, Clock, Truck } from "lucide-react";

export default function PortalCliente() {
  const clientName = "Heineken";
  const myOrders = ORDERS.filter(o => o.client === clientName).slice(0, 8);

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Portal do Cliente"
        subtitle={`Visão do cliente ${clientName} — abre solicitação, acompanha SLA, anexa NF, aprova exceção. Substitui o e-mail.`}
        actions={<Btn variant="primary"><Plus className="h-3 w-3" /> Nova solicitação</Btn>}
      />

      {/* Identidade cliente */}
      <div className="panel p-4 flex items-center gap-4 bg-gradient-glow card-interactive animate-fade-in-up">
        <div className="h-12 w-12 rounded-md bg-surface-2 grid place-items-center hover-scale cursor-pointer animate-pulse-glow">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 animate-fade-in-left" style={{ animationDelay: '100ms' }}>
          <div className="text-sm font-semibold">{clientName} — Operação Sudeste</div>
          <div className="text-[11px] text-muted-foreground">Contrato: MSA Master 2024 · SLA padrão: Janela 06-10h · Contato Begur: Amanda Santos</div>
        </div>
        <div className="flex gap-6 stagger-children">
          <div className="text-center"><div className="text-xl font-bold tnum number-animate">412</div><div className="text-[10px] text-muted-foreground">pedidos 30d</div></div>
          <div className="text-center"><div className="text-xl font-bold tnum text-success number-animate" style={{ animationDelay: '100ms' }}>98,1%</div><div className="text-[10px] text-muted-foreground">OTIF</div></div>
          <div className="text-center"><div className="text-xl font-bold tnum text-warning number-animate badge-pulse" style={{ animationDelay: '200ms' }}>3</div><div className="text-[10px] text-muted-foreground">aprovações</div></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Nova solicitação */}
        <div className="panel col-span-12 lg:col-span-5 p-4 card-interactive animate-fade-in-left" style={{ animationDelay: '100ms' }}>
          <div className="text-sm font-semibold mb-1">Abrir nova solicitação</div>
          <div className="text-[11px] text-muted-foreground mb-3">Em vez de mandar planilha por e-mail, abra a solicitação direto. O analista Begur recebe na fila.</div>
          <div className="space-y-2.5 stagger-children">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Tipo de movimento</label>
              <select className="w-full mt-1 bg-surface-2 border border-border rounded px-2 py-1.5 text-sm transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30">
                <option>Reposição PDV</option>
                <option>Instalação de equipamento</option>
                <option>Retirada / troca remessa</option>
                <option>Cross-docking</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Mercadoria</label>
              <input className="w-full mt-1 bg-surface-2 border border-border rounded px-2 py-1.5 text-sm transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30" defaultValue="Chopeira Heineken Sub 30L · 14 un" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Origem</label>
                <input className="w-full mt-1 bg-surface-2 border border-border rounded px-2 py-1.5 text-sm transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30" defaultValue="CD Heineken — Jacareí/SP" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Janela</label>
                <input className="w-full mt-1 bg-surface-2 border border-border rounded px-2 py-1.5 text-sm transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/30" defaultValue="06h-10h" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Anexos</label>
              <div className="mt-1 border border-dashed border-border rounded p-3 text-center text-[11px] text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
                <Upload className="h-4 w-4 mx-auto mb-1 animate-subtle-bounce" />
                Solte NF, planilha ou foto aqui
              </div>
            </div>
            <Btn variant="primary" className="w-full justify-center">Enviar solicitação</Btn>
          </div>
        </div>

        {/* Aprovações pendentes */}
        <div className="panel col-span-12 lg:col-span-7">
          <div className="panel-header">
            <div>
              <div className="text-sm font-semibold">Aprovações pendentes do cliente</div>
              <div className="text-[11px] text-muted-foreground">Exceções que precisam da decisão do {clientName}.</div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {[
              { order: "BGR-248942", type: "Recusa parcial", body: "PDV Pão de Açúcar Vila Olímpia recebeu 6 de 8 chopeiras. Câmara fria sem espaço.", action: "Aceitar reentrega amanhã 06h" },
              { order: "BGR-248908", type: "Avaria", body: "3 chopeiras com lacre violado na recepção do CD Begur. Aguarda decisão de devolução ou laudo.", action: "Aprovar devolução" },
              { order: "BGR-248876", type: "Reagendamento", body: "Loja fechada na entrega — sugerimos amanhã 09h.", action: "Confirmar nova janela" },
            ].map((a, i) => (
              <div 
                key={i} 
                className="p-3 row-animate animate-fade-in-right"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="chip bg-warning/10 text-warning border-warning/30 text-[10px] animate-pulse">{a.type}</span>
                  <span className="text-xs font-mono text-muted-foreground">{a.order}</span>
                </div>
                <div className="text-xs">{a.body}</div>
                <div className="flex gap-2 mt-2 stagger-children">
                  <Btn variant="primary">{a.action}</Btn>
                  <Btn>Recusar</Btn>
                  <Btn><MessageSquare className="h-3 w-3" /> Conversar</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acompanhamento */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold">Meus pedidos — acompanhamento em tempo real</div>
          <Btn>Exportar relatório</Btn>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Pedido</th>
              <th className="text-left px-3 py-2 font-medium">Carga</th>
              <th className="text-left px-3 py-2 font-medium">Destino</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">SLA</th>
              <th className="text-right px-4 py-2 font-medium">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {myOrders.map((o, i) => (
              <tr 
                key={o.id} 
                className="row-animate animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-2 font-mono text-xs text-primary">{o.id}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground truncate max-w-[220px]">{o.qty} {o.unit} · {o.cargo}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground truncate max-w-[200px]">{o.destination}</td>
                <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                <td className="px-3 py-2"><SlaBadge sla={o.sla} /></td>
                <td className="px-4 py-2 text-right text-xs tnum">{o.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
