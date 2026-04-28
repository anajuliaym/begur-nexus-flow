import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { CUSTOMERS } from "@/data/mock";
import { Building2, FileText, ExternalLink, Plus, ArrowUpRight } from "lucide-react";

export default function Customers() {
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Customers"
        subtitle="Master data, contracts, SLA configurations and customer portal access"
        actions={<><Btn variant="outline"><FileText className="h-3 w-3"/> Contracts</Btn><Btn variant="primary"><Plus className="h-3 w-3"/> New customer</Btn></>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">All customers</div>
            <Filters items={["All","Telecom B2B","Residential","Enterprise"]}/>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground border-b border-border">
                <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                  <th>Customer</th><th>Segment</th><th>Orders/30d</th><th>OTIF</th><th>SLA</th><th>Contract</th><th></th>
                </tr>
              </thead>
              <tbody className="tnum">
                {CUSTOMERS.map(c => (
                  <tr key={c.name} className="border-b border-border row-hover">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-surface-3 grid place-items-center text-[11px] font-bold">{c.name.slice(0,2)}</div>
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-[10px] text-muted-foreground">{c.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="chip border-border text-muted-foreground">{c.segment}</span></td>
                    <td className="px-3 py-3 font-semibold">{c.orders30}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${c.otif >= 97 ? "text-success" : c.otif >= 95 ? "text-warning" : "text-destructive"}`}>{c.otif}%</span>
                        <div className="h-1 w-12 bg-surface-3 rounded-full overflow-hidden"><div className="h-full bg-success" style={{ width: `${c.otif}%` }}/></div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{c.sla}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.contract}</td>
                    <td className="px-3 py-3"><Btn variant="ghost"><ArrowUpRight className="h-3 w-3"/></Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer portal preview */}
        <div className="col-span-12 xl:col-span-5 panel overflow-hidden">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><Building2 className="h-3.5 w-3.5"/> Customer portal · live preview</div>
            <Btn variant="outline">Open portal <ExternalLink className="h-3 w-3"/></Btn>
          </div>
          <div className="bg-surface-1 p-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gradient-primary"/>
                  <span className="text-xs font-semibold">Vivo Empresas · Begur Portal</span>
                </div>
                <span className="text-[10px] text-muted-foreground">portal.begur.com.br/vivo</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[["Open requests","18"],["In route","42"],["OTIF (30d)","98.1%"]].map(([l,v]) => (
                    <div key={l} className="rounded border border-border bg-surface-1 p-2">
                      <div className="text-[10px] text-muted-foreground">{l}</div>
                      <div className="text-sm font-semibold tnum mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Recent shipments</div>
                  <div className="space-y-1.5">
                    {["BGR-248942","BGR-248941","BGR-248939","BGR-248938"].map((id, i) => (
                      <div key={id} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded border border-border bg-surface-1">
                        <span className="font-mono text-primary">{id}</span>
                        <span className="text-muted-foreground truncate mx-2 flex-1">Campinas/SP · 14 itens</span>
                        <span className={`chip text-[10px] ${i===0?"bg-primary/10 text-primary border-primary/30":"bg-success/10 text-success border-success/30"}`}>{i===0?"In route":"Delivered"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button className="text-[11px] py-2 rounded border border-border bg-surface-1 hover:bg-surface-2">Track</button>
                  <button className="text-[11px] py-2 rounded border border-border bg-surface-1 hover:bg-surface-2">Open ticket</button>
                  <button className="text-[11px] py-2 rounded border border-border bg-surface-1 hover:bg-surface-2">Documents</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
