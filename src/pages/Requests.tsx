import { useState } from "react";
import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { INBOX } from "@/data/mock";
import { Mail, MessageSquare, Globe, Layout, Edit3, Sparkles, CheckCircle2, FileText, User, Paperclip, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNEL_ICON: any = { Email: Mail, WhatsApp: MessageSquare, API: Globe, Portal: Layout, Manual: Edit3 };

export default function Requests() {
  const [sel, setSel] = useState(INBOX[0]);
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Omnichannel inbox"
        subtitle="Unified intake for requests across email, WhatsApp, client APIs and portals — extracted by AI"
        actions={<>
          <Filters items={["All channels","Email","WhatsApp","API","Portal","Manual"]} />
          <Btn variant="primary"><Sparkles className="h-3 w-3"/> Extract all</Btn>
        </>}
      />

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Channels */}
        <div className="col-span-2 panel p-2 space-y-1">
          {[
            { l: "All", c: 162 }, { l: "Email", c: 84, i: Mail }, { l: "WhatsApp", c: 36, i: MessageSquare },
            { l: "API", c: 28, i: Globe }, { l: "Portal", c: 11, i: Layout }, { l: "Manual", c: 3, i: Edit3 },
          ].map((s, i) => (
            <button key={s.l} className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs",
              i === 0 ? "bg-primary/15 text-primary" : "hover:bg-accent text-muted-foreground"
            )}>
              <span className="flex items-center gap-2">{s.i ? <s.i className="h-3.5 w-3.5"/> : <span className="w-3.5"/>}{s.l}</span>
              <span className="tnum">{s.c}</span>
            </button>
          ))}
          <div className="border-t border-border my-2" />
          <div className="text-[10px] text-muted-foreground px-2 uppercase tracking-wider">Status</div>
          {["New","AI extracted","Validated","Assigned","Closed"].map(s => (
            <button key={s} className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-accent text-muted-foreground">{s}</button>
          ))}
        </div>

        {/* Inbox list */}
        <div className="col-span-4 panel overflow-hidden flex flex-col">
          <div className="panel-header">
            <div className="text-xs font-semibold">Queue · {INBOX.length}</div>
            <Btn variant="ghost">Sort: newest</Btn>
          </div>
          <div className="overflow-y-auto divide-y divide-border">
            {INBOX.map(m => {
              const Icon = CHANNEL_ICON[m.channel];
              const active = sel.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSel(m)}
                  className={cn("w-full text-left p-3 hover:bg-accent/40 transition", active && "bg-accent/60 border-l-2 border-l-primary")}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-primary"/>
                    <span className="text-[11px] font-mono text-muted-foreground">{m.id}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{m.received}</span>
                  </div>
                  <div className="text-xs font-semibold truncate">{m.subject}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{m.from}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={cn("chip text-[10px]",
                      m.status === "extracted" ? "bg-info/10 text-info border-info/30" :
                      m.status === "validated" ? "bg-primary/10 text-primary border-primary/30" :
                      m.status === "assigned" ? "bg-success/10 text-success border-success/30" :
                      "bg-warning/10 text-warning border-warning/30")}>{m.status}</span>
                    <span className="chip text-[10px] border-border text-muted-foreground">
                      <Sparkles className="h-2.5 w-2.5"/> {Math.round(m.ai_confidence * 100)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="col-span-6 panel flex flex-col">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{sel.id}</span>
              <span className="text-sm font-semibold">{sel.subject}</span>
            </div>
            <div className="flex gap-1.5">
              <Btn variant="outline">Reject</Btn>
              <Btn variant="outline">Assign analyst</Btn>
              <Btn variant="primary">Create order <ArrowRight className="h-3 w-3"/></Btn>
            </div>
          </div>
          <div className="overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-surface-3 grid place-items-center text-xs font-semibold">{sel.client.slice(0,2)}</div>
              <div>
                <div className="text-sm font-semibold">{sel.client}</div>
                <div className="text-[11px] text-muted-foreground">{sel.from}</div>
              </div>
              <div className="ml-auto text-[11px] text-muted-foreground">{sel.received}</div>
            </div>

            <div className="rounded-md border border-border bg-surface-1 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>Prezados,</p>
              <p className="mt-2">Solicitamos a entrega dos seguintes equipamentos para o nosso cliente corporativo em <b className="text-foreground">Campinas/SP</b> (CEP 13050-220), com prazo SLA de 24 horas.</p>
              <ul className="mt-2 list-disc ml-5 space-y-0.5 text-xs">
                <li>14 unidades — ONT Huawei HG8245</li>
                <li>14 unidades — Roteador WiFi 6 AX1800</li>
                <li>2 unidades — Switch 24P PoE</li>
              </ul>
              <p className="mt-3">Contato no local: <b className="text-foreground">João Pedro · +55 19 9 9821-4410</b></p>
              <p className="mt-2">Atenciosamente, equipe de logística.</p>
              <div className="mt-3 flex items-center gap-2 text-[11px]"><Paperclip className="h-3 w-3"/> nota_fiscal_88210.pdf · 412 KB</div>
            </div>

            {/* AI extraction */}
            <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <div className="text-xs font-semibold text-primary">AI extraction · confidence {Math.round(sel.ai_confidence*100)}%</div>
                <CheckCircle2 className="h-3.5 w-3.5 text-success ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ["Client", sel.client], ["Destination", "Campinas/SP — CEP 13050-220"],
                  ["SLA", "24 hours"], ["Items", "30 units · 3 SKUs"],
                  ["Contact", "João Pedro · +55 19 9 9821-4410"], ["Service window", "08:00–18:00 weekdays"],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-1.5">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-1.5">
                <Btn variant="primary"><CheckCircle2 className="h-3 w-3"/> Validate & queue</Btn>
                <Btn variant="outline"><User className="h-3 w-3"/> Assign to analyst</Btn>
                <Btn variant="ghost"><FileText className="h-3 w-3"/> Edit fields</Btn>
              </div>
            </div>

            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Activity</div>
            <ol className="space-y-2 text-xs">
              {[
                ["AI extracted 6 fields with 97% confidence", "2 min ago"],
                ["Received via Email gateway", "2 min ago"],
                ["Sender domain validated · vivo.com.br ✓", "2 min ago"],
              ].map(([t, when], i) => (
                <li key={i} className="flex gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5"/>
                  <div className="flex-1">{t}</div>
                  <span className="text-muted-foreground">{when}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
