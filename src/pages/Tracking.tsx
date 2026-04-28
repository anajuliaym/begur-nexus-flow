import { PageHeader, Btn, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { ORDERS } from "@/data/mock";
import { MapPin, Phone, MessageSquare, Camera, Navigation, CheckCircle2, Clock, Truck, Package, FileText, ChevronRight } from "lucide-react";

export default function Tracking() {
  const order = ORDERS.find(o => o.status === "in_route")!;

  const timeline = [
    { t: "Order created", time: "Yesterday 09:14", done: true, icon: FileText, by: "Vivo Empresas via Email" },
    { t: "Validated by analyst", time: "Yesterday 09:32", done: true, icon: CheckCircle2, by: "A. Santos" },
    { t: "Awaiting separation", time: "Yesterday 11:00", done: true, icon: Package, by: "CD Barueri" },
    { t: "Equipment picked · SN 9000137", time: "Today 08:14", done: true, icon: Package, by: "Op. M. Lima" },
    { t: "Loaded on dock 04", time: "Today 12:30", done: true, icon: Truck, by: "Wave 2" },
    { t: "Driver in route", time: "Today 13:42", done: true, current: true, icon: Navigation, by: order.driver },
    { t: "Out for delivery", time: "ETA 14:30", done: false, icon: MapPin, by: "—" },
    { t: "Delivered with POD", time: "—", done: false, icon: CheckCircle2, by: "—" },
  ];

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Shipment tracking"
        subtitle={`${order.id} · ${order.client} · ${order.destination}`}
        actions={<>
          <Btn variant="outline"><Phone className="h-3 w-3"/> Call driver</Btn>
          <Btn variant="outline"><MessageSquare className="h-3 w-3"/> Notify client</Btn>
          <Btn variant="primary"><Navigation className="h-3 w-3"/> Live track</Btn>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Map area */}
        <div className="col-span-12 xl:col-span-8 panel overflow-hidden">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping"/><span className="relative h-2 w-2 rounded-full bg-success"/></span>
              Live position · {order.driver}
            </div>
            <div className="text-xs text-muted-foreground">ETA <b className="text-foreground">14:30</b> · 18 min remaining</div>
          </div>
          <div className="relative h-[420px] bg-grid bg-surface-1 overflow-hidden">
            {/* Faux map */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
              <defs>
                <linearGradient id="r" x1="0" x2="1">
                  <stop offset="0%" stopColor="hsl(188 92% 48%)"/><stop offset="100%" stopColor="hsl(212 92% 60%)"/>
                </linearGradient>
              </defs>
              <path d="M 40 380 Q 200 320 280 280 T 520 200 T 760 120" stroke="url(#r)" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
              <path d="M 40 380 Q 200 320 280 280 T 520 200" stroke="hsl(188 92% 48%)" strokeWidth="3" fill="none"/>
            </svg>
            {/* Stops */}
            {[
              { x: 40, y: 380, label: "CD Barueri", done: true },
              { x: 280, y: 280, label: "Stop 1 · Osasco", done: true },
              { x: 520, y: 200, label: "Stop 2 · Pinheiros", current: true },
              { x: 760, y: 120, label: "Stop 3 · Vila Madalena", done: false },
            ].map((s, i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: s.x, top: s.y }}>
                <div className={`h-4 w-4 rounded-full border-2 ${s.current ? "bg-primary border-primary-glow shadow-glow animate-pulse" : s.done ? "bg-success border-success" : "bg-surface-3 border-border"}`}/>
                <div className="mt-1 text-[10px] font-semibold whitespace-nowrap bg-surface-2/90 backdrop-blur px-1.5 py-0.5 rounded border border-border">{s.label}</div>
              </div>
            ))}
            {/* Driver pin */}
            <div className="absolute" style={{ left: 520, top: 200 }}>
              <div className="absolute -translate-x-1/2 -translate-y-full -mt-4 bg-primary text-primary-foreground rounded-md px-2 py-1 text-[10px] font-semibold shadow-glow flex items-center gap-1">
                <Truck className="h-3 w-3"/> {order.driver}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t border-border text-xs">
            {[
              ["Distance","187 km"], ["Stops","12 / 14"], ["Speed","58 km/h"], ["Last ping","14 sec ago"],
            ].map(([l,v]) => (
              <div key={l} className="p-3 border-r border-border last:border-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                <div className="font-semibold mt-0.5 tnum">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline + details */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <div className="panel p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-primary grid place-items-center text-primary-foreground font-bold">{order.driver?.split(" ").map(s=>s[0]).join("")}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{order.driver}</div>
                <div className="text-[11px] text-muted-foreground">VUC MNT-4A12 · ⭐ 4.9 · 42 trips/30d</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><div className="text-[10px] text-muted-foreground">SLA</div><SlaBadge sla={order.sla}/></div>
              <div><div className="text-[10px] text-muted-foreground">Status</div><StatusBadge status={order.status}/></div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="text-sm font-semibold flex items-center gap-2"><Clock className="h-3.5 w-3.5"/> Timeline</div></div>
            <ol className="p-4 space-y-3">
              {timeline.map((e, i) => (
                <li key={i} className="flex gap-3 relative">
                  {i < timeline.length - 1 && <div className="absolute left-3 top-6 bottom-[-12px] w-px bg-border"/>}
                  <div className={`h-6 w-6 shrink-0 rounded-full grid place-items-center border-2 ${
                    e.current ? "bg-primary border-primary-glow shadow-glow" :
                    e.done ? "bg-success/15 border-success text-success" : "bg-surface-2 border-border text-muted-foreground"
                  }`}>
                    <e.icon className="h-3 w-3"/>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className={`text-xs font-semibold ${!e.done && "text-muted-foreground"}`}>{e.t}</div>
                    <div className="text-[10px] text-muted-foreground">{e.time} · {e.by}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="panel p-4">
            <div className="text-xs font-semibold flex items-center gap-2 mb-2"><Camera className="h-3.5 w-3.5"/> Proof of delivery</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-square rounded border border-border bg-grid bg-surface-2 grid place-items-center">
                  <Camera className="h-4 w-4 text-muted-foreground"/>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">Awaiting POD upload from driver</div>
          </div>
        </div>
      </div>
    </div>
  );
}
