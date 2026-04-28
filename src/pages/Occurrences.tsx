import { useState } from "react";
import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { OCCURRENCES } from "@/data/mock";
import { AlertTriangle, MessageSquare, Phone, Mail, Camera, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const SEV_LABEL: Record<string, string> = { high: "alta", medium: "média", low: "baixa" };

export default function Occurrences() {
  const [sel, setSel] = useState(OCCURRENCES[0]);
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Monitoramento e ocorrências"
        subtitle="Gestão de exceções operacionais · resolução e rastreamento de comunicação"
        actions={<><Filters items={["Todas","Recusa","Atraso","Avaria","Endereço","Reentrega","Equipamento"]}/><Btn variant="primary"><AlertTriangle className="h-3 w-3"/> Nova ocorrência</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Em aberto", v: 23, t: "destructive" },
          { l: "Em revisão", v: 11, t: "warning" },
          { l: "Tempo médio de resolução", v: "2h 14min", t: "info" },
          { l: "Resolvidas (24h)", v: 184, t: "success" },
        ].map(s => (
          <div key={s.l} className="panel p-4">
            <div className="stat-label">{s.l}</div>
            <div className="stat-value mt-1.5" style={{ color: `hsl(var(--${s.t}))` }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-5 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Ocorrências em aberto</div>
            <span className="chip border-border text-muted-foreground">{OCCURRENCES.length}</span>
          </div>
          <div className="divide-y divide-border max-h-[640px] overflow-y-auto">
            {OCCURRENCES.map(o => {
              const sevTone = o.severity === "high" ? "destructive" : o.severity === "medium" ? "warning" : "muted-foreground";
              return (
                <button key={o.id} onClick={() => setSel(o)} className={cn(
                  "w-full text-left p-3.5 hover:bg-accent/40 transition flex gap-3",
                  sel.id === o.id && "bg-accent/60 border-l-2 border-l-primary"
                )}>
                  <div className="h-8 w-8 shrink-0 rounded-md grid place-items-center" style={{ background: `hsl(var(--${sevTone}) / 0.15)`, color: `hsl(var(--${sevTone}))` }}>
                    <AlertTriangle className="h-4 w-4"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{o.type}</span>
                      <span className="chip text-[10px] border-border text-muted-foreground">{o.client}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">{o.opened}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{o.reason}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="font-mono text-[10px] text-primary">{o.order}</span>
                      <span className="ml-auto chip text-[10px] border-border text-muted-foreground">{o.status}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-7 panel">
          <div className="panel-header">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold">{sel.type} · {sel.client}</div>
              <span className="font-mono text-[11px] text-primary">{sel.order}</span>
            </div>
            <div className="flex gap-1.5">
              <Btn variant="outline">Reatribuir</Btn>
              <Btn variant="outline">Agendar reentrega</Btn>
              <Btn variant="primary"><CheckCircle2 className="h-3 w-3"/> Resolver</Btn>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {[
              ["Severidade", SEV_LABEL[sel.severity] ?? sel.severity], ["Status", sel.status], ["Responsável", sel.owner], ["Aberta em", sel.opened],
              ["Motivo", sel.reason], ["Pedido vinculado", sel.order],
            ].map(([k,v]) => (
              <div key={k} className="rounded-md border border-border bg-surface-1 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="text-sm font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Registro de comunicação</div>
            <div className="space-y-2">
              {[
                { ch: Phone, who: "Mon. Squad A → Motorista", text: "Confirmou tentativa às 14:12. Cliente ausente.", time: "12 min" },
                { ch: MessageSquare, who: "WhatsApp → Cliente", text: "Tentativa de contato — sem resposta.", time: "9 min" },
                { ch: Mail, who: "E-mail → Solicitante (Vivo)", text: "Notificação de nova tentativa enviada para amanhã 09h00.", time: "5 min" },
                { ch: Camera, who: "Upload do motorista", text: "Foto da fachada anexada como evidência.", time: "3 min" },
              ].map((m, i) => (
                <div key={i} className="flex gap-2.5 p-2.5 rounded-md border border-border bg-surface-1">
                  <div className="h-7 w-7 shrink-0 rounded-md bg-primary/15 text-primary grid place-items-center"><m.ch className="h-3.5 w-3.5"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{m.who}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground"><Clock className="h-2.5 w-2.5 inline"/> há {m.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 bg-surface-2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Adicionar nota interna ou enviar mensagem…"/>
              <Btn variant="primary">Enviar</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
