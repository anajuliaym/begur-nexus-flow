// Centralized mock data for Begur Control Tower
export type OrderStatus =
  | "awaiting_separation"
  | "awaiting_service_order"
  | "awaiting_routing"
  | "in_route"
  | "delivered"
  | "not_delivered"
  | "equipment_unavailable"
  | "exception_pending";

export const STATUS_META: Record<OrderStatus, { label: string; tone: string }> = {
  awaiting_separation: { label: "Awaiting separation", tone: "bg-warning/10 text-warning border-warning/30" },
  awaiting_service_order: { label: "Awaiting service order", tone: "bg-info/10 text-info border-info/30" },
  awaiting_routing: { label: "Awaiting routing", tone: "bg-info/10 text-info border-info/30" },
  in_route: { label: "In route", tone: "bg-primary/10 text-primary border-primary/30" },
  delivered: { label: "Delivered", tone: "bg-success/10 text-success border-success/30" },
  not_delivered: { label: "Not delivered", tone: "bg-destructive/10 text-destructive border-destructive/30" },
  equipment_unavailable: { label: "Equipment unavailable", tone: "bg-critical/10 text-[hsl(var(--critical))] border-[hsl(var(--critical))]/30" },
  exception_pending: { label: "Exception pending", tone: "bg-critical/10 text-[hsl(var(--critical))] border-[hsl(var(--critical))]/30" },
};

export interface Order {
  id: string;
  client: string;
  origin: string;
  destination: string;
  city: string;
  uf: string;
  status: OrderStatus;
  equipment: string;
  serial?: string;
  driver?: string;
  eta: string;
  sla: "on_track" | "at_risk" | "breached";
  value: number;
  created: string;
  channel: "Email" | "WhatsApp" | "API" | "Portal" | "Manual";
}

const clients = ["Vivo Empresas", "Claro NXT", "TIM Live", "Algar Telecom", "Oi Soluções", "Embratel", "Sercomtel", "Brisanet"];
const cities = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Porto Alegre", "RS"], ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"], ["Brasília", "DF"],
  ["Campinas", "SP"], ["Goiânia", "GO"], ["Manaus", "AM"],
];
const equip = ["ONT Huawei HG8245", "Roteador WiFi 6 AX1800", "Decoder 4K", "Switch 24P PoE", "Modem DOCSIS 3.1", "Repetidor Mesh", "STB Android TV", "ONU Nokia G-140W"];
const drivers = ["Carlos Mendes", "Ana Ribeiro", "João Silva", "Marcos Pereira", "Lucas Almeida", "Patrícia Souza", "Fábio Costa", "Renata Lima"];
const channels: Order["channel"][] = ["Email", "WhatsApp", "API", "Portal", "Manual"];
const statuses: OrderStatus[] = [
  "awaiting_separation","awaiting_service_order","awaiting_routing","in_route","in_route","in_route",
  "delivered","delivered","not_delivered","equipment_unavailable","exception_pending"
];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export const ORDERS: Order[] = Array.from({ length: 64 }).map((_, i) => {
  const [city, uf] = rand(cities, i * 3);
  const status = rand(statuses, i * 7 + 1);
  const sla = i % 9 === 0 ? "breached" : i % 5 === 0 ? "at_risk" : "on_track";
  return {
    id: `BGR-${(248910 + i).toString()}`,
    client: rand(clients, i),
    origin: "CD Begur — Barueri/SP",
    destination: `${city}/${uf}`,
    city, uf,
    status,
    equipment: rand(equip, i * 2),
    serial: `SN${(900000000 + i * 137).toString()}`,
    driver: status === "in_route" || status === "delivered" || status === "not_delivered" ? rand(drivers, i) : undefined,
    eta: ["Today 14:30", "Today 17:10", "Tomorrow 09:00", "Tomorrow 11:45", "Today 19:20", "Apr 30 08:00"][i % 6],
    sla,
    value: 480 + (i * 137) % 4200,
    created: ["12 min ago","34 min ago","1h ago","2h ago","3h ago","Yesterday","2d ago"][i % 7],
    channel: rand(channels, i),
  };
});

export const KPIS = [
  { label: "Active orders", value: "1,284", delta: "+8.2%", tone: "primary" },
  { label: "In route", value: "342", delta: "+12", tone: "info" },
  { label: "Delivered today", value: "896", delta: "+4.1%", tone: "success" },
  { label: "SLA at risk", value: "47", delta: "−6", tone: "warning" },
  { label: "Exceptions", value: "23", delta: "+3", tone: "destructive" },
  { label: "OTIF (7d)", value: "97.4%", delta: "+0.8pp", tone: "success" },
];

export interface Inbox {
  id: string;
  channel: "Email" | "WhatsApp" | "API" | "Portal";
  from: string;
  subject: string;
  preview: string;
  received: string;
  ai_confidence: number;
  status: "new" | "extracted" | "validated" | "assigned";
  client: string;
}

export const INBOX: Inbox[] = [
  { id: "INB-9821", channel: "Email", from: "logistica@vivo.com.br", subject: "Solicitação de entrega — 14 ONTs Huawei — Campinas", preview: "Prezados, segue lista anexa para entrega urgente...", received: "2 min ago", ai_confidence: 0.97, status: "extracted", client: "Vivo Empresas" },
  { id: "INB-9820", channel: "WhatsApp", from: "+55 11 9 8821-4410 (Claro)", subject: "Retirada de equipamento — cliente B2B", preview: "Bom dia, precisamos retirar 3 decoders...", received: "8 min ago", ai_confidence: 0.89, status: "new", client: "Claro NXT" },
  { id: "INB-9819", channel: "API", from: "tim.api/orders", subject: "Bulk order push — 42 items", preview: "POST /orders payload validated", received: "12 min ago", ai_confidence: 1.0, status: "validated", client: "TIM Live" },
  { id: "INB-9818", channel: "Email", from: "operacoes@algar.com.br", subject: "Reagendamento — pedido BGR-248912", preview: "Por favor, reagendar para sexta-feira...", received: "22 min ago", ai_confidence: 0.94, status: "assigned", client: "Algar Telecom" },
  { id: "INB-9817", channel: "Portal", from: "portal.begur/oi", subject: "Nova OS — instalação corporativa", preview: "Cliente final: Banco Itaú agência 0481", received: "31 min ago", ai_confidence: 1.0, status: "extracted", client: "Oi Soluções" },
  { id: "INB-9816", channel: "Email", from: "compras@embratel.com.br", subject: "Cotação retornada — aprovado", preview: "Aprovado conforme cotação 4421...", received: "44 min ago", ai_confidence: 0.91, status: "new", client: "Embratel" },
  { id: "INB-9815", channel: "WhatsApp", from: "+55 41 9 7712-0033", subject: "Equipamento com defeito — troca", preview: "Cliente reportou que ONU não liga...", received: "1h ago", ai_confidence: 0.82, status: "new", client: "Sercomtel" },
];

export const TRIPS = [
  { id: "TRP-44218", driver: "Carlos Mendes", vehicle: "VUC — MNT-4A12", stops: 12, distance: "187 km", revenue: 4280, cost: 2940, margin: 31.3, status: "In progress", region: "Grande SP" },
  { id: "TRP-44217", driver: "Ana Ribeiro", vehicle: "Fiorino — KLM-2D55", stops: 8, distance: "94 km", revenue: 2110, cost: 1480, margin: 29.9, status: "In progress", region: "ABC Paulista" },
  { id: "TRP-44216", driver: "João Silva", vehicle: "VUC — RTQ-9988", stops: 14, distance: "242 km", revenue: 5120, cost: 3640, margin: 28.9, status: "Planned", region: "Vale do Paraíba" },
  { id: "TRP-44215", driver: "Marcos Pereira", vehicle: "3/4 — BPX-1199", stops: 22, distance: "318 km", revenue: 7840, cost: 5210, margin: 33.5, status: "Manifest ready", region: "Litoral SP" },
  { id: "TRP-44214", driver: "Lucas Almeida", vehicle: "VUC — JKW-7720", stops: 10, distance: "129 km", revenue: 3280, cost: 2410, margin: 26.5, status: "Closed", region: "Campinas" },
  { id: "TRP-44213", driver: "Patrícia Souza", vehicle: "Fiorino — TRC-3344", stops: 6, distance: "62 km", revenue: 1480, cost: 980, margin: 33.8, status: "In progress", region: "Centro SP" },
];

export const OCCURRENCES = [
  { id: "OCR-1184", order: "BGR-248942", type: "Refusal", severity: "high", client: "Vivo Empresas", reason: "Cliente ausente — segunda tentativa", opened: "12 min ago", owner: "Mon. Squad A", status: "Investigating" },
  { id: "OCR-1183", order: "BGR-248921", type: "Delay", severity: "medium", client: "Claro NXT", reason: "Tráfego intenso na Marginal", opened: "34 min ago", owner: "Mon. Squad B", status: "Communicated" },
  { id: "OCR-1182", order: "BGR-248908", type: "Damage", severity: "high", client: "TIM Live", reason: "Embalagem violada na recepção", opened: "1h ago", owner: "Quality", status: "Awaiting evidence" },
  { id: "OCR-1181", order: "BGR-248899", type: "Address", severity: "low", client: "Algar Telecom", reason: "CEP divergente — confirmado novo endereço", opened: "2h ago", owner: "Analyst — A. Santos", status: "Resolved" },
  { id: "OCR-1180", order: "BGR-248876", type: "Re-delivery", severity: "medium", client: "Oi Soluções", reason: "Reagendado para amanhã 09h", opened: "3h ago", owner: "Mon. Squad A", status: "Scheduled" },
  { id: "OCR-1179", order: "BGR-248844", type: "Equipment", severity: "high", client: "Embratel", reason: "Serial divergente do pedido", opened: "5h ago", owner: "Cross-dock", status: "In review" },
];

export const DRIVERS = [
  { name: "Carlos Mendes", doc: "CPF 124.***.***-09", cnh: "E", vehicle: "VUC", region: "Grande SP", trips30: 42, otif: 98.2, rating: 4.9, status: "Available" },
  { name: "Ana Ribeiro", doc: "CPF 332.***.***-12", cnh: "D", vehicle: "Fiorino", region: "ABC", trips30: 38, otif: 96.4, rating: 4.8, status: "On trip" },
  { name: "João Silva", doc: "CPF 887.***.***-44", cnh: "E", vehicle: "VUC", region: "Vale", trips30: 31, otif: 94.1, rating: 4.6, status: "On trip" },
  { name: "Marcos Pereira", doc: "CPF 221.***.***-78", cnh: "E", vehicle: "3/4", region: "Litoral", trips30: 27, otif: 97.0, rating: 4.7, status: "Available" },
  { name: "Lucas Almeida", doc: "CPF 902.***.***-30", cnh: "D", vehicle: "VUC", region: "Campinas", trips30: 35, otif: 95.5, rating: 4.7, status: "Off-duty" },
  { name: "Patrícia Souza", doc: "CPF 410.***.***-21", cnh: "D", vehicle: "Fiorino", region: "Centro SP", trips30: 44, otif: 99.1, rating: 5.0, status: "Available" },
];

export const COMPLIANCE = [
  { entity: "Carlos Mendes", item: "CNH", expires: "2026-08-12", status: "ok" },
  { entity: "Carlos Mendes", item: "ASO médico", expires: "2026-05-04", status: "warning" },
  { entity: "Ana Ribeiro", item: "MOPP", expires: "2026-02-18", status: "warning" },
  { entity: "VUC MNT-4A12", item: "CRLV", expires: "2026-11-30", status: "ok" },
  { entity: "VUC MNT-4A12", item: "Insurance", expires: "2026-04-30", status: "critical" },
  { entity: "Fiorino KLM-2D55", item: "Maintenance — 30k km", expires: "2026-05-22", status: "warning" },
  { entity: "Cargo Insurance — Apólice 8821", item: "Renewal", expires: "2026-09-01", status: "ok" },
  { entity: "João Silva", item: "Background check", expires: "2026-03-10", status: "critical" },
];

export const CUSTOMERS = [
  { name: "Vivo Empresas", segment: "Telecom B2B", orders30: 412, otif: 98.1, sla: "4h", contract: "Master MSA 2024", contact: "logistica@vivo.com.br" },
  { name: "Claro NXT", segment: "Telecom B2B", orders30: 298, otif: 96.4, sla: "6h", contract: "MSA + SOW 12", contact: "ops@claro.com.br" },
  { name: "TIM Live", segment: "Residential", orders30: 521, otif: 97.8, sla: "Same-day", contract: "Master 2025", contact: "delivery@tim.com.br" },
  { name: "Algar Telecom", segment: "Telecom Regional", orders30: 187, otif: 95.0, sla: "24h", contract: "Annual 2025", contact: "operacoes@algar.com.br" },
  { name: "Oi Soluções", segment: "Telecom B2B", orders30: 132, otif: 93.2, sla: "12h", contract: "MSA + 4 SOWs", contact: "compras@oi.com.br" },
  { name: "Embratel", segment: "Enterprise", orders30: 224, otif: 99.0, sla: "8h", contract: "Master 2024", contact: "supply@embratel.com" },
];

export const HEATMAP = Array.from({ length: 7 * 24 }).map((_, i) => ({
  d: Math.floor(i / 24),
  h: i % 24,
  v: Math.max(0, Math.round(40 + 30 * Math.sin(i / 5) + 25 * Math.cos(i / 9) + (Math.random() * 20 - 10))),
}));

export const AI_RECS = [
  { icon: "sparkles", title: "Re-route TRP-44216 via Anchieta", body: "Saves 38 min vs Imigrantes; +R$ 220 margin uplift.", impact: "high" },
  { icon: "alert", title: "5 orders likely to breach SLA", body: "Cluster in Zona Leste/SP — recommend pulling forward to wave 2.", impact: "high" },
  { icon: "package", title: "Consolidate 12 small parcels", body: "Vivo + Claro — same destination CEP 13050. Estimated −R$ 410 cost.", impact: "med" },
  { icon: "user", title: "Driver Patrícia under-utilized", body: "Available capacity 4h. Suggest reassign 6 stops from TRP-44213.", impact: "med" },
];
