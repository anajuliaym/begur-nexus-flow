// Dados mockados centralizados — Begur Control Tower
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
  awaiting_separation: { label: "Aguardando separação", tone: "bg-warning/10 text-warning border-warning/30" },
  awaiting_service_order: { label: "Aguardando OS", tone: "bg-info/10 text-info border-info/30" },
  awaiting_routing: { label: "Aguardando roteirização", tone: "bg-info/10 text-info border-info/30" },
  in_route: { label: "Em rota", tone: "bg-primary/10 text-primary border-primary/30" },
  delivered: { label: "Entregue", tone: "bg-success/10 text-success border-success/30" },
  not_delivered: { label: "Não entregue", tone: "bg-destructive/10 text-destructive border-destructive/30" },
  equipment_unavailable: { label: "Equipamento indisponível", tone: "bg-critical/10 text-[hsl(var(--critical))] border-[hsl(var(--critical))]/30" },
  exception_pending: { label: "Ocorrência pendente", tone: "bg-critical/10 text-[hsl(var(--critical))] border-[hsl(var(--critical))]/30" },
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
    eta: ["Hoje 14:30", "Hoje 17:10", "Amanhã 09:00", "Amanhã 11:45", "Hoje 19:20", "30/abr 08:00"][i % 6],
    sla,
    value: 480 + (i * 137) % 4200,
    created: ["há 12 min","há 34 min","há 1h","há 2h","há 3h","Ontem","há 2 dias"][i % 7],
    channel: rand(channels, i),
  };
});

export const KPIS = [
  { label: "Pedidos ativos", value: "1.284", delta: "+8,2%", tone: "primary" },
  { label: "Em rota", value: "342", delta: "+12", tone: "info" },
  { label: "Entregues hoje", value: "896", delta: "+4,1%", tone: "success" },
  { label: "SLA em risco", value: "47", delta: "−6", tone: "warning" },
  { label: "Ocorrências", value: "23", delta: "+3", tone: "destructive" },
  { label: "OTIF (7d)", value: "97,4%", delta: "+0,8pp", tone: "success" },
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
  { id: "INB-9821", channel: "Email", from: "logistica@vivo.com.br", subject: "Solicitação de entrega — 14 ONTs Huawei — Campinas", preview: "Prezados, segue lista anexa para entrega urgente...", received: "há 2 min", ai_confidence: 0.97, status: "extracted", client: "Vivo Empresas" },
  { id: "INB-9820", channel: "WhatsApp", from: "+55 11 9 8821-4410 (Claro)", subject: "Retirada de equipamento — cliente B2B", preview: "Bom dia, precisamos retirar 3 decoders...", received: "há 8 min", ai_confidence: 0.89, status: "new", client: "Claro NXT" },
  { id: "INB-9819", channel: "API", from: "tim.api/orders", subject: "Push em massa — 42 itens", preview: "POST /orders payload validado", received: "há 12 min", ai_confidence: 1.0, status: "validated", client: "TIM Live" },
  { id: "INB-9818", channel: "Email", from: "operacoes@algar.com.br", subject: "Reagendamento — pedido BGR-248912", preview: "Por favor, reagendar para sexta-feira...", received: "há 22 min", ai_confidence: 0.94, status: "assigned", client: "Algar Telecom" },
  { id: "INB-9817", channel: "Portal", from: "portal.begur/oi", subject: "Nova OS — instalação corporativa", preview: "Cliente final: Banco Itaú agência 0481", received: "há 31 min", ai_confidence: 1.0, status: "extracted", client: "Oi Soluções" },
  { id: "INB-9816", channel: "Email", from: "compras@embratel.com.br", subject: "Cotação retornada — aprovado", preview: "Aprovado conforme cotação 4421...", received: "há 44 min", ai_confidence: 0.91, status: "new", client: "Embratel" },
  { id: "INB-9815", channel: "WhatsApp", from: "+55 41 9 7712-0033", subject: "Equipamento com defeito — troca", preview: "Cliente reportou que ONU não liga...", received: "há 1h", ai_confidence: 0.82, status: "new", client: "Sercomtel" },
];

export const TRIPS = [
  { id: "TRP-44218", driver: "Carlos Mendes", vehicle: "VUC — MNT-4A12", stops: 12, distance: "187 km", revenue: 4280, cost: 2940, margin: 31.3, status: "Em andamento", region: "Grande SP" },
  { id: "TRP-44217", driver: "Ana Ribeiro", vehicle: "Fiorino — KLM-2D55", stops: 8, distance: "94 km", revenue: 2110, cost: 1480, margin: 29.9, status: "Em andamento", region: "ABC Paulista" },
  { id: "TRP-44216", driver: "João Silva", vehicle: "VUC — RTQ-9988", stops: 14, distance: "242 km", revenue: 5120, cost: 3640, margin: 28.9, status: "Planejada", region: "Vale do Paraíba" },
  { id: "TRP-44215", driver: "Marcos Pereira", vehicle: "3/4 — BPX-1199", stops: 22, distance: "318 km", revenue: 7840, cost: 5210, margin: 33.5, status: "Manifesto pronto", region: "Litoral SP" },
  { id: "TRP-44214", driver: "Lucas Almeida", vehicle: "VUC — JKW-7720", stops: 10, distance: "129 km", revenue: 3280, cost: 2410, margin: 26.5, status: "Encerrada", region: "Campinas" },
  { id: "TRP-44213", driver: "Patrícia Souza", vehicle: "Fiorino — TRC-3344", stops: 6, distance: "62 km", revenue: 1480, cost: 980, margin: 33.8, status: "Em andamento", region: "Centro SP" },
];

export const OCCURRENCES = [
  { id: "OCR-1184", order: "BGR-248942", type: "Recusa", severity: "high", client: "Vivo Empresas", reason: "Cliente ausente — segunda tentativa", opened: "há 12 min", owner: "Mon. Squad A", status: "Em investigação" },
  { id: "OCR-1183", order: "BGR-248921", type: "Atraso", severity: "medium", client: "Claro NXT", reason: "Tráfego intenso na Marginal", opened: "há 34 min", owner: "Mon. Squad B", status: "Comunicada" },
  { id: "OCR-1182", order: "BGR-248908", type: "Avaria", severity: "high", client: "TIM Live", reason: "Embalagem violada na recepção", opened: "há 1h", owner: "Qualidade", status: "Aguardando evidência" },
  { id: "OCR-1181", order: "BGR-248899", type: "Endereço", severity: "low", client: "Algar Telecom", reason: "CEP divergente — confirmado novo endereço", opened: "há 2h", owner: "Analista — A. Santos", status: "Resolvida" },
  { id: "OCR-1180", order: "BGR-248876", type: "Reentrega", severity: "medium", client: "Oi Soluções", reason: "Reagendado para amanhã 09h", opened: "há 3h", owner: "Mon. Squad A", status: "Agendada" },
  { id: "OCR-1179", order: "BGR-248844", type: "Equipamento", severity: "high", client: "Embratel", reason: "Serial divergente do pedido", opened: "há 5h", owner: "Cross-dock", status: "Em revisão" },
];

export const DRIVERS = [
  { name: "Carlos Mendes", doc: "CPF 124.***.***-09", cnh: "E", vehicle: "VUC", region: "Grande SP", trips30: 42, otif: 98.2, rating: 4.9, status: "Disponível" },
  { name: "Ana Ribeiro", doc: "CPF 332.***.***-12", cnh: "D", vehicle: "Fiorino", region: "ABC", trips30: 38, otif: 96.4, rating: 4.8, status: "Em viagem" },
  { name: "João Silva", doc: "CPF 887.***.***-44", cnh: "E", vehicle: "VUC", region: "Vale", trips30: 31, otif: 94.1, rating: 4.6, status: "Em viagem" },
  { name: "Marcos Pereira", doc: "CPF 221.***.***-78", cnh: "E", vehicle: "3/4", region: "Litoral", trips30: 27, otif: 97.0, rating: 4.7, status: "Disponível" },
  { name: "Lucas Almeida", doc: "CPF 902.***.***-30", cnh: "D", vehicle: "VUC", region: "Campinas", trips30: 35, otif: 95.5, rating: 4.7, status: "Folga" },
  { name: "Patrícia Souza", doc: "CPF 410.***.***-21", cnh: "D", vehicle: "Fiorino", region: "Centro SP", trips30: 44, otif: 99.1, rating: 5.0, status: "Disponível" },
];

export const COMPLIANCE = [
  { entity: "Carlos Mendes", item: "CNH", expires: "2026-08-12", status: "ok" },
  { entity: "Carlos Mendes", item: "ASO médico", expires: "2026-05-04", status: "warning" },
  { entity: "Ana Ribeiro", item: "MOPP", expires: "2026-02-18", status: "warning" },
  { entity: "VUC MNT-4A12", item: "CRLV", expires: "2026-11-30", status: "ok" },
  { entity: "VUC MNT-4A12", item: "Seguro", expires: "2026-04-30", status: "critical" },
  { entity: "Fiorino KLM-2D55", item: "Manutenção — 30 mil km", expires: "2026-05-22", status: "warning" },
  { entity: "Seguro de carga — Apólice 8821", item: "Renovação", expires: "2026-09-01", status: "ok" },
  { entity: "João Silva", item: "Verificação de antecedentes", expires: "2026-03-10", status: "critical" },
];

export const CUSTOMERS = [
  { name: "Vivo Empresas", segment: "Telecom B2B", orders30: 412, otif: 98.1, sla: "4h", contract: "MSA Master 2024", contact: "logistica@vivo.com.br" },
  { name: "Claro NXT", segment: "Telecom B2B", orders30: 298, otif: 96.4, sla: "6h", contract: "MSA + SOW 12", contact: "ops@claro.com.br" },
  { name: "TIM Live", segment: "Residencial", orders30: 521, otif: 97.8, sla: "Mesmo dia", contract: "Master 2025", contact: "delivery@tim.com.br" },
  { name: "Algar Telecom", segment: "Telecom Regional", orders30: 187, otif: 95.0, sla: "24h", contract: "Anual 2025", contact: "operacoes@algar.com.br" },
  { name: "Oi Soluções", segment: "Telecom B2B", orders30: 132, otif: 93.2, sla: "12h", contract: "MSA + 4 SOWs", contact: "compras@oi.com.br" },
  { name: "Embratel", segment: "Enterprise", orders30: 224, otif: 99.0, sla: "8h", contract: "Master 2024", contact: "supply@embratel.com" },
];

export const HEATMAP = Array.from({ length: 7 * 24 }).map((_, i) => ({
  d: Math.floor(i / 24),
  h: i % 24,
  v: Math.max(0, Math.round(40 + 30 * Math.sin(i / 5) + 25 * Math.cos(i / 9) + (Math.random() * 20 - 10))),
}));

export const AI_RECS = [
  { icon: "sparkles", title: "Reroteirizar TRP-44216 via Anchieta", body: "Economiza 38 min vs Imigrantes; +R$ 220 de margem.", impact: "alta" },
  { icon: "alert", title: "5 pedidos com risco de quebra de SLA", body: "Cluster na Zona Leste/SP — recomendado antecipar para a onda 2.", impact: "alta" },
  { icon: "package", title: "Consolidar 12 pacotes pequenos", body: "Vivo + Claro — mesmo CEP de destino 13050. Estimativa −R$ 410 de custo.", impact: "média" },
  { icon: "user", title: "Motorista Patrícia subutilizada", body: "Capacidade ociosa de 4h. Sugerir realocar 6 paradas da TRP-44213.", impact: "média" },
];
