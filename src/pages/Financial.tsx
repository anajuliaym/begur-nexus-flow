import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { DRIVERS, TRIPS } from "@/data/mock";
import { Wallet, FileSignature, Plus, Download, ArrowUpRight } from "lucide-react";

export default function Financial() {
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Financial · carriers & settlements"
        subtitle="Drivers, aggregates, trip settlements and commercial substitution payments"
        actions={<><Btn variant="outline"><Download className="h-3 w-3"/> Export ledger</Btn><Btn variant="primary"><FileSignature className="h-3 w-3"/> Run settlement</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Pending settlement", v: "R$ 184,210", t: "warning" },
          { l: "Paid this month", v: "R$ 1.42M", t: "success" },
          { l: "Substitution payments", v: "R$ 12,840", t: "info" },
          { l: "Active aggregates", v: "84", t: "primary" },
        ].map(k => (
          <div key={k.l} className="panel p-4">
            <div className="stat-label">{k.l}</div>
            <div className="stat-value mt-1.5" style={{ color: `hsl(var(--${k.t}))` }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><Wallet className="h-3.5 w-3.5"/> Drivers & aggregates</div>
            <Filters items={["All","Available","On trip","Off-duty"]}/>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground border-b border-border">
                <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                  <th>Driver</th><th>Doc</th><th>CNH</th><th>Vehicle</th><th>Region</th><th>Trips/30d</th><th>OTIF</th><th>Rating</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {DRIVERS.map(d => (
                  <tr key={d.name} className="border-b border-border row-hover">
                    <td className="px-3 py-3 font-medium">{d.name}</td>
                    <td className="px-3 py-3 text-muted-foreground font-mono text-[10px]">{d.doc}</td>
                    <td className="px-3 py-3"><span className="chip border-border text-muted-foreground">{d.cnh}</span></td>
                    <td className="px-3 py-3">{d.vehicle}</td>
                    <td className="px-3 py-3 text-muted-foreground">{d.region}</td>
                    <td className="px-3 py-3">{d.trips30}</td>
                    <td className="px-3 py-3 text-success">{d.otif}%</td>
                    <td className="px-3 py-3">⭐ {d.rating}</td>
                    <td className="px-3 py-3"><span className={`chip ${d.status==="Available"?"bg-success/10 text-success border-success/30":d.status==="On trip"?"bg-primary/10 text-primary border-primary/30":"border-border text-muted-foreground"}`}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Trip settlements · pending</div>
            <Btn variant="primary"><Plus className="h-3 w-3"/> Generate</Btn>
          </div>
          <div className="divide-y divide-border">
            {TRIPS.map(t => {
              const pay = Math.round(t.revenue * 0.18);
              return (
                <div key={t.id} className="p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-surface-3 grid place-items-center text-[10px] font-bold">{t.driver.split(" ").map(s=>s[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{t.driver}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{t.id} · {t.stops} stops · {t.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold tnum">R$ {pay.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">due Apr 30</div>
                  </div>
                  <Btn variant="ghost"><ArrowUpRight className="h-3 w-3"/></Btn>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
