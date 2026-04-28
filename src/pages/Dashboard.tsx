import { Kpi, PageHeader, StatusBadge, SlaBadge, Btn, Filters } from "@/components/ui-kit";
import { ORDERS, KPIS, AI_RECS, HEATMAP, TRIPS } from "@/data/mock";
import {
  Activity, Truck, AlertTriangle, Boxes, Clock, CheckCircle2, Sparkles,
  TrendingUp, ArrowUpRight, MapPin, Zap, Radio
} from "lucide-react";

const ICONS: any = { primary: Activity, info: Truck, success: CheckCircle2, warning: Clock, destructive: AlertTriangle };

export default function Dashboard() {
  const inRoute = ORDERS.filter(o => o.status === "in_route").slice(0, 6);
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Control Tower"
        subtitle="Real-time operational command center · Tuesday, April 28, 2026 · 14:32 BRT"
        actions={
          <>
            <Filters items={["Today","This week","MTD","QTD"]} />
            <Btn variant="outline"><Radio className="h-3 w-3" /> Live</Btn>
            <Btn variant="primary"><Sparkles className="h-3 w-3" /> AI digest</Btn>
          </>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {KPIS.map(k => <Kpi key={k.label} {...k} icon={ICONS[k.tone]} />)}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Heatmap */}
        <div className="col-span-12 xl:col-span-8 panel">
          <div className="panel-header">
            <div>
              <div className="text-sm font-semibold">Operational heatmap — deliveries / hour</div>
              <div className="text-xs text-muted-foreground">Last 7 days · São Paulo metropolitan region</div>
            </div>
            <Filters items={["Volume","SLA risk","Margin"]} />
          </div>
          <div className="p-4">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1 text-[10px] text-muted-foreground pt-5">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="h-5 flex items-center">{d}</div>)}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-24 gap-[3px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={h} className="text-[9px] text-muted-foreground text-center mb-1">{h.toString().padStart(2,"0")}</div>
                  ))}
                  {HEATMAP.map((c, i) => {
                    const a = Math.min(1, c.v / 100);
                    return (
                      <div key={i}
                        className="h-5 rounded-[3px] border border-white/5"
                        style={{ background: `hsl(188 92% 48% / ${a})` }}
                        title={`${c.v} deliveries`}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>Less</span>
                  {[0.1,0.3,0.5,0.7,0.9].map(a => <span key={a} className="h-3 w-3 rounded-sm" style={{background:`hsl(188 92% 48% / ${a})`}}/>)}
                  <span>More</span>
                  <span className="ml-auto">Peak: 14:00–17:00 · Tue/Thu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI recommendations */}
        <div className="col-span-12 xl:col-span-4 panel relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
          <div className="panel-header relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <div className="text-sm font-semibold">AI Recommendations</div>
            </div>
            <span className="chip bg-primary/10 text-primary border-primary/30">4 new</span>
          </div>
          <div className="p-3 space-y-2 relative">
            {AI_RECS.map((r, i) => (
              <div key={i} className="rounded-md border border-border bg-surface-2/60 p-3 hover:bg-surface-3 transition cursor-pointer group">
                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 shrink-0 rounded-md bg-primary/15 grid place-items-center">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold">{r.title}</div>
                      <span className={`chip text-[10px] ${r.impact === "high" ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30"}`}>{r.impact}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.body}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Btn variant="primary" className="h-7 px-2.5">Apply</Btn>
                      <Btn variant="ghost" className="h-7 px-2.5">Dismiss</Btn>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live orders in route */}
        <div className="col-span-12 xl:col-span-8 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Live shipments — in route
            </div>
            <Btn variant="ghost">View all <ArrowUpRight className="h-3 w-3" /></Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground border-b border-border">
                <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2 uppercase tracking-wider text-[10px]">
                  <th>Order</th><th>Client</th><th>Destination</th><th>Driver</th><th>ETA</th><th>SLA</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {inRoute.map(o => (
                  <tr key={o.id} className="border-b border-border row-hover">
                    <td className="px-3 py-2.5 font-mono text-[11px] text-primary">{o.id}</td>
                    <td className="px-3 py-2.5 font-medium">{o.client}</td>
                    <td className="px-3 py-2.5 text-muted-foreground"><MapPin className="h-3 w-3 inline mr-1" />{o.destination}</td>
                    <td className="px-3 py-2.5">{o.driver}</td>
                    <td className="px-3 py-2.5">{o.eta}</td>
                    <td className="px-3 py-2.5"><SlaBadge sla={o.sla} /></td>
                    <td className="px-3 py-2.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: cross dock + exceptions */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <div className="panel">
            <div className="panel-header">
              <div className="text-sm font-semibold flex items-center gap-2"><Boxes className="h-3.5 w-3.5" /> Cross-dock workload</div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: "Separation queue", v: 142, max: 200, tone: "primary" },
                { name: "Awaiting service order", v: 38, max: 80, tone: "info" },
                { name: "Loading dock", v: 22, max: 30, tone: "warning" },
                { name: "Dispatch ready", v: 89, max: 120, tone: "success" },
              ].map(b => (
                <div key={b.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{b.name}</span>
                    <span className="tnum font-semibold">{b.v}<span className="text-muted-foreground"> / {b.max}</span></span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className={`h-full bg-${b.tone}`} style={{ width: `${(b.v/b.max)*100}%`, background: `hsl(var(--${b.tone}))` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="text-sm font-semibold flex items-center gap-2 text-destructive"><AlertTriangle className="h-3.5 w-3.5" /> Exceptions</div>
              <span className="chip bg-destructive/10 text-destructive border-destructive/30">23 open</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { id: "OCR-1184", t: "Refusal — Vivo", time: "12 min" },
                { id: "OCR-1183", t: "Delay — Marginal Tietê", time: "34 min" },
                { id: "OCR-1182", t: "Damage — TIM Live", time: "1h" },
                { id: "OCR-1179", t: "Equipment serial divergence", time: "5h" },
              ].map(e => (
                <div key={e.id} className="p-3 flex items-center gap-3 hover:bg-accent/40">
                  <span className="h-7 w-7 rounded-md bg-destructive/10 text-destructive grid place-items-center"><AlertTriangle className="h-3.5 w-3.5"/></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{e.t}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{e.id}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trips overview */}
        <div className="col-span-12 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5"/> Active trips · viability</div>
            <Filters items={["All","In progress","Planned","Closed"]} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground border-b border-border">
                <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2 uppercase tracking-wider text-[10px]">
                  <th>Trip</th><th>Driver / Vehicle</th><th>Region</th><th>Stops</th><th>Distance</th><th>Revenue</th><th>Cost</th><th>Margin</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {TRIPS.map(t => (
                  <tr key={t.id} className="border-b border-border row-hover">
                    <td className="px-3 py-2.5 font-mono text-[11px] text-primary">{t.id}</td>
                    <td className="px-3 py-2.5"><div className="font-medium">{t.driver}</div><div className="text-[10px] text-muted-foreground">{t.vehicle}</div></td>
                    <td className="px-3 py-2.5">{t.region}</td>
                    <td className="px-3 py-2.5">{t.stops}</td>
                    <td className="px-3 py-2.5">{t.distance}</td>
                    <td className="px-3 py-2.5 text-success">R$ {t.revenue.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">R$ {t.cost.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{t.margin}%</span>
                        <div className="h-1 w-12 bg-surface-3 rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${t.margin*2}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><span className="chip border-border text-muted-foreground">{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
