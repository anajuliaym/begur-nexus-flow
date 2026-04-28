import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { TrendingUp, Target, Activity, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

function Bar({ data, max, color = "primary" }: any) {
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v: number, i: number) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${(v/max)*100}%`, background: `hsl(var(--${color}) / ${0.3 + (v/max)*0.7})` }}/>
      ))}
    </div>
  );
}

function Spark({ data, color = "primary" }: any) {
  const max = Math.max(...data); const min = Math.min(...data);
  const points = data.map((v: number, i: number) => `${(i/(data.length-1))*100},${100 - ((v-min)/(max-min))*100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12">
      <polyline points={points} fill="none" stroke={`hsl(var(--${color}))`} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

export default function Analytics() {
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="SLA & analytics"
        subtitle="Operational performance, OTIF, productivity and bottleneck analytics"
        actions={<><Filters items={["7d","30d","QTD","YTD"]}/><Btn variant="primary"><Sparkles className="h-3 w-3"/> AI insights</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "OTIF", v: "97.4%", d: "+0.8pp", up: true, c: "success" },
          { l: "On-time delivery", v: "98.2%", d: "+0.4pp", up: true, c: "success" },
          { l: "First-attempt success", v: "94.1%", d: "−1.2pp", up: false, c: "warning" },
          { l: "Avg cost per stop", v: "R$ 18.40", d: "−R$ 0.80", up: true, c: "primary" },
        ].map(k => (
          <div key={k.l} className="panel p-4">
            <div className="stat-label">{k.l}</div>
            <div className="flex items-end justify-between mt-1.5">
              <div className="stat-value">{k.v}</div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${k.up ? "text-success" : "text-destructive"}`}>
                {k.up ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownRight className="h-3 w-3"/>}{k.d}
              </span>
            </div>
            <div className="mt-2"><Spark data={[40,52,48,60,58,72,68,80,76,88,85,94]} color={k.c}/></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5"/> Deliveries vs SLA breaches · 30 days</div>
            <Filters items={["Daily","Weekly"]}/>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-1 h-56">
              {Array.from({ length: 30 }).map((_, i) => {
                const v = 60 + Math.round(40 * Math.sin(i / 3) + Math.random() * 30);
                const breach = Math.max(0, Math.round(v * 0.06 + Math.random() * 4));
                return (
                  <div key={i} className="flex-1 flex flex-col-reverse gap-px">
                    <div className="bg-primary/70 rounded-t-sm" style={{ height: `${(v - breach)/120 * 100}%` }}/>
                    <div className="bg-destructive rounded-t-sm" style={{ height: `${breach/120 * 100}%` }}/>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-primary/70 rounded-sm"/>On-time</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-destructive rounded-sm"/>SLA breach</span>
              <span className="ml-auto">Apr 1 → Apr 28, 2026</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 panel">
          <div className="panel-header"><div className="text-sm font-semibold flex items-center gap-2"><Target className="h-3.5 w-3.5"/> OTIF by client</div></div>
          <div className="p-4 space-y-3">
            {[
              { c: "Embratel", v: 99.0 }, { c: "TIM Live", v: 97.8 }, { c: "Vivo Empresas", v: 98.1 },
              { c: "Claro NXT", v: 96.4 }, { c: "Algar Telecom", v: 95.0 }, { c: "Oi Soluções", v: 93.2 },
            ].map(c => (
              <div key={c.c}>
                <div className="flex items-center justify-between text-xs"><span>{c.c}</span><span className="tnum font-semibold">{c.v}%</span></div>
                <div className="mt-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${c.v}%`, background: c.v >= 97 ? "hsl(var(--success))" : c.v >= 95 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 panel">
          <div className="panel-header"><div className="text-sm font-semibold flex items-center gap-2"><Activity className="h-3.5 w-3.5"/> Bottleneck analysis</div></div>
          <div className="p-5 space-y-3">
            {[
              { stage: "Cross-dock separation", time: "2h 18m", pct: 42, change: "+8m" },
              { stage: "Awaiting routing", time: "1h 42m", pct: 31, change: "−12m" },
              { stage: "Driver pickup", time: "38m", pct: 12, change: "+2m" },
              { stage: "Last-mile transit", time: "47m", pct: 15, change: "−4m" },
            ].map(b => (
              <div key={b.stage} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{b.stage}</span>
                    <span className="text-muted-foreground"><b className="text-foreground">{b.time}</b> · {b.change} vs prev</span>
                  </div>
                  <div className="mt-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${b.pct}%` }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 panel">
          <div className="panel-header"><div className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary"/> AI opportunity insights</div></div>
          <div className="p-4 space-y-2">
            {[
              { t: "Wave 2 consolidation", b: "Combining Vivo + Claro Zona Leste deliveries could save R$ 18,400/month.", d: "high" },
              { t: "Driver utilization", b: "3 drivers operating below 60% capacity. Reassignment opportunity: R$ 9,200/month.", d: "med" },
              { t: "Toll cost reduction", b: "Switching 14% of trips to alternative routes reduces tolls by 22% with neutral SLA.", d: "med" },
              { t: "Equipment pre-allocation", b: "ONT serial pre-binding reduces dock dwell-time by 28 minutes per wave.", d: "high" },
            ].map((o, i) => (
              <div key={i} className="rounded-md border border-border bg-surface-1 p-3 hover:bg-surface-2 transition">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold">{o.t}</div>
                  <span className={`chip text-[10px] ${o.d==="high"?"bg-destructive/10 text-destructive border-destructive/30":"bg-warning/10 text-warning border-warning/30"}`}>{o.d}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{o.b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
