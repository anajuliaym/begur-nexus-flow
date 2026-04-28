import { useState } from "react";
import { PageHeader, Btn, Filters, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { ORDERS, STATUS_META } from "@/data/mock";
import { Plus, Download, MoreHorizontal, Mail, MessageSquare, Globe, Layout, Edit3, Paperclip } from "lucide-react";

const CHANNEL_ICON: any = { Email: Mail, WhatsApp: MessageSquare, API: Globe, Portal: Layout, Manual: Edit3 };

export default function Orders() {
  const [tab, setTab] = useState<string>("all");
  const counts = Object.entries(STATUS_META).map(([k, v]) => ({ k, v, c: ORDERS.filter(o => o.status === k).length }));
  const filtered = tab === "all" ? ORDERS : ORDERS.filter(o => o.status === tab);

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Orders"
        subtitle={`Full lifecycle management · ${ORDERS.length} orders shown of 1,284 total`}
        actions={<>
          <Btn variant="outline"><Download className="h-3 w-3"/> Export</Btn>
          <Btn variant="primary"><Plus className="h-3 w-3"/> New order</Btn>
        </>}
      />

      {/* Status pills with counts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button onClick={() => setTab("all")}
          className={`px-3 h-8 rounded-md text-xs font-medium border whitespace-nowrap ${tab==="all" ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"}`}>
          All <span className="ml-1.5 tnum opacity-70">{ORDERS.length}</span>
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
          <Filters items={["All clients","Vivo","Claro","TIM","Algar","Oi","Embratel"]} />
          <div className="flex gap-1.5">
            <Btn variant="outline">Bulk actions</Btn>
            <Btn variant="ghost"><MoreHorizontal className="h-3 w-3"/></Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border bg-surface-1/50 sticky top-0">
              <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                <th><input type="checkbox" className="accent-primary"/></th>
                <th>Order</th><th>Client</th><th>Channel</th><th>Equipment</th>
                <th>Destination</th><th>Driver</th><th>ETA</th><th>SLA</th><th>Status</th><th>Value</th><th>Created</th><th></th>
              </tr>
            </thead>
            <tbody className="tnum">
              {filtered.slice(0, 30).map(o => {
                const Ch = CHANNEL_ICON[o.channel];
                return (
                  <tr key={o.id} className="border-b border-border row-hover">
                    <td className="px-3 py-2.5"><input type="checkbox" className="accent-primary"/></td>
                    <td className="px-3 py-2.5">
                      <div className="font-mono text-[11px] text-primary">{o.id}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Paperclip className="h-2.5 w-2.5"/>SN {o.serial?.slice(-6)}</div>
                    </td>
                    <td className="px-3 py-2.5 font-medium">{o.client}</td>
                    <td className="px-3 py-2.5"><span className="inline-flex items-center gap-1 text-muted-foreground"><Ch className="h-3 w-3"/>{o.channel}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[160px]">{o.equipment}</td>
                    <td className="px-3 py-2.5">{o.destination}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{o.driver ?? "—"}</td>
                    <td className="px-3 py-2.5">{o.eta}</td>
                    <td className="px-3 py-2.5"><SlaBadge sla={o.sla}/></td>
                    <td className="px-3 py-2.5"><StatusBadge status={o.status}/></td>
                    <td className="px-3 py-2.5">R$ {o.value.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{o.created}</td>
                    <td className="px-3 py-2.5"><Btn variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal className="h-3 w-3"/></Btn></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1–30 of {filtered.length}</span>
          <div className="flex gap-1">
            <Btn variant="outline">Prev</Btn>
            <Btn variant="outline">Next</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
