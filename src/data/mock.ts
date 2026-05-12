// Begur Controle — Modelo de dados centrado em Entrega (Case)
// Plataforma SaaS de gestão operacional logística.
// NÃO substitui TOTVS TMS/WMS — centraliza, integra (API) e exibe operação em tempo real.
// Fonte de dados: TOTVS TMS (NF-e/CT-e/frete), TOTVS WMS (estoque, leitura), Make (e-mail→OS),
// Ferramenta de campo (GPS/roteirização/POD).
// Serviços Begur: Cross Docking, Armazenagem, Separação/Kits, Movimentação/Positivação,
// Logística Reversa, Distribuição Nacional, Gestão de Fretes, Rastreamento.

export type DeliveryStage = "solicitacao" | "crossdocking" | "preparacao" | "execucao" | "concluida";
export type DeliveryType = "entrega" | "coleta" | "reentrega" | "remessa";
export type OccurrenceType = "recusa" | "avaria" | "atraso" | "endereco" | "reentrega" | "equipamento";
export type Severity = "low" | "medium" | "high";
export type RequestChannel = "email" | "whatsapp" | "manual" | "api";
export type RequestStatus = "pendente" | "em_analise" | "convertida" | "recusada";

// Status operacional fino (Painel Kanban — espelha o fluxo TOTVS/Field Tool)
export type OperationalStatus =
  | "entrada_pendente"   // NF-e recebida, aguardando validação
  | "programada"         // OS criada e roteirizada
  | "em_rota"            // veículo em trânsito (GPS ativo)
  | "entregue"           // POD coletado
  | "ocorrencia"         // exceção registrada
  | "faturada";          // CT-e emitido / fechamento OK

export type SefazStatus = "autorizada" | "rejeitada" | "cancelada" | "pendente";
export type DataSource = "totvs_tms" | "make_email" | "field_tool" | "manual" | "api";

export const STAGE_META: Record<DeliveryStage, { label: string; color: string; order: number }> = {
  solicitacao: { label: "Solicitação", color: "bg-info/15 text-info border-info/30", order: 0 },
  crossdocking: { label: "Cross-Docking", color: "bg-warning/15 text-warning border-warning/30", order: 1 },
  preparacao: { label: "Preparação", color: "bg-accent-foreground/15 text-accent-foreground border-accent-foreground/30", order: 2 },
  execucao: { label: "Em Execução", color: "bg-primary/15 text-primary border-primary/30", order: 3 },
  concluida: { label: "Concluída", color: "bg-success/15 text-success border-success/30", order: 4 },
};

export const TYPE_LABELS: Record<DeliveryType, string> = {
  entrega: "Entrega",
  coleta: "Coleta",
  reentrega: "Reentrega",
  remessa: "Remessa",
};

export const CHANNEL_META: Record<RequestChannel, { label: string; color: string }> = {
  email: { label: "E-mail", color: "bg-info/15 text-info border-info/30" },
  whatsapp: { label: "WhatsApp", color: "bg-success/15 text-success border-success/30" },
  manual: { label: "Manual", color: "bg-primary/15 text-primary border-primary/30" },
  api: { label: "API", color: "bg-warning/15 text-warning border-warning/30" },
};

export const REQUEST_STATUS_META: Record<RequestStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning/15 text-warning border-warning/30" },
  em_analise: { label: "Em análise", color: "bg-info/15 text-info border-info/30" },
  convertida: { label: "Convertida", color: "bg-success/15 text-success border-success/30" },
  recusada: { label: "Recusada", color: "bg-destructive/15 text-destructive border-destructive/30" },
};

export interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  type: "system" | "driver" | "analyst" | "client" | "exception";
}

export interface Occurrence {
  id: string;
  deliveryId: string;
  type: OccurrenceType;
  severity: Severity;
  description: string;
  opened: string;
  status: "aberta" | "em_analise" | "resolvida";
  owner: string;
}

export interface ServiceRequest {
  id: string;
  channel: RequestChannel;
  status: RequestStatus;
  client: string;
  subject: string;
  preview: string;
  fullBody: string;
  senderName: string;
  senderEmail: string;
  receivedAt: string;
  items: { name: string; qty: number }[];
  destination?: string;
  notes?: string;
  convertedTo?: string;
}

export interface NfeData {
  chave: string;          // 44 dígitos
  numero: string;
  serie: string;
  valor: number;
  emitidaEm: string;
  statusSefaz: SefazStatus;
}

export interface CteData {
  chave: string;
  numero: string;
  valor: number;
  emitidoEm?: string;
  statusSefaz: SefazStatus;
}

export interface VehiclePosition {
  lat: number;
  lng: number;
  timestamp: string;
  ignitionOn: boolean;
  speedKmh: number;
}

export interface VehicleData {
  plate: string;
  model: string;
  type: "VUC" | "Truck" | "Toco" | "Carreta";
  hasPlatform: boolean;
  lastPosition?: VehiclePosition;
}

export interface PodData {
  photoUrl: string;
  signatureUrl: string;
  gps: { lat: number; lng: number };
  timestamp: string;
  pdfUrl: string;
  recipientName: string;
  recipientDoc?: string;
}

export interface Delivery {
  id: string;                        // BGR-XXXX (interno)
  osNumber: string;                  // OS-XXXXX (TOTVS TMS)
  viagem?: string;                   // TRP-XXXXX (roteirização)
  source: DataSource;                // origem do dado (TOTVS / Make / manual)
  client: string;
  clientContact: string;
  type: DeliveryType;
  stage: DeliveryStage;              // pipeline visual de alto nível (5 fases)
  operationalStatus: OperationalStatus; // sub-status fino (Kanban operacional)
  origin: string;
  destination: string;
  city: string;
  uf: string;
  items: { name: string; qty: number; sku?: string }[];
  driver?: string;
  driverPhone?: string;
  driverId?: string;                 // FK -> AGREGADOS
  vehicle?: VehicleData;
  nfe?: NfeData;
  cte?: CteData;
  pod?: PodData;
  sla: string;
  slaStatus: "on_track" | "at_risk" | "breached";
  created: string;
  eta?: string;
  value: number;                     // valor do frete
  analystId: string;
  timeline: TimelineEvent[];
  occurrences: string[];
  notes?: string;
  recipientName?: string;
  feedback?: string;
}

// Begur's real clients
const clients = [
  { name: "3L", contact: "logistica@3l.com.br" },
  { name: "Bacio di Latte", contact: "ops@baciodilatte.com.br" },
  { name: "Froneri", contact: "supply@froneri.com.br" },
  { name: "Heineken", contact: "logistica@heineken.com.br" },
  { name: "Metalfrio T1", contact: "operacoes.t1@metalfrio.com.br" },
  { name: "Metalfrio T2", contact: "operacoes.t2@metalfrio.com.br" },
  { name: "Natural One", contact: "entregas@naturalone.com.br" },
  { name: "Nestlé", contact: "supply.chain@nestle.com.br" },
  { name: "Seara", contact: "logistica@seara.com.br" },
  { name: "Solar", contact: "distribuicao@solar.com.br" },
];

const cities: [string, string][] = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Campinas", "SP"], ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"],
  ["Brasília", "DF"], ["Goiânia", "GO"], ["Porto Alegre", "RS"], ["Manaus", "AM"],
];

const equip = [
  "Freezer Metalfrio VF55", "Freezer Horizontal Metalfrio DA420", "Refrigerador Vertical Metalfrio VB28",
  "Cooler Metalfrio CL200", "Freezer Expositor Metalfrio VF50F", "Geladeira Comercial Metalfrio VN44",
  "Cervejeira Metalfrio VN50", "Freezer Ilha Metalfrio NF40", "Refrigerador Solar 440L",
  "Expositor Refrigerado Froneri EF300", "Freezer Vertical Nestlé FV120", "Ilha Refrigerada Solar IR200",
];

// Agregados (motoristas terceirizados) — usados pelo módulo Gestão de Agregados
export interface AgregadoDoc {
  type: "CNH" | "ANTT" | "RNTRC" | "ASO" | "CRLV" | "Seguro";
  number: string;
  expiresAt: string; // ISO date
  status: "ok" | "vencendo" | "vencido";
}

export interface Agregado {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  bank: { bank: string; agency: string; account: string };
  vehiclePlate: string;
  docs: AgregadoDoc[];
  rating: number; // 0-5
  trips30: number;
}

export const AGREGADOS: Agregado[] = [
  {
    id: "AGR-001", name: "Carlos Mendes", phone: "+55 11 99821-4410", cpf: "123.456.789-00",
    bank: { bank: "Itaú", agency: "0432", account: "12345-6" }, vehiclePlate: "RGB-4A12",
    rating: 4.8, trips30: 42,
    docs: [
      { type: "CNH", number: "04321987654", expiresAt: "2027-03-15", status: "ok" },
      { type: "ANTT", number: "RNTRC-7821345", expiresAt: "2026-06-10", status: "vencendo" },
      { type: "ASO", number: "ASO-2025-0421", expiresAt: "2026-05-28", status: "vencendo" },
      { type: "CRLV", number: "CRLV-RGB4A12", expiresAt: "2026-12-31", status: "ok" },
      { type: "Seguro", number: "APL-994321", expiresAt: "2026-09-15", status: "ok" },
    ],
  },
  {
    id: "AGR-002", name: "Ana Ribeiro", phone: "+55 11 98832-1122", cpf: "234.567.890-11",
    bank: { bank: "Bradesco", agency: "1234", account: "56789-0" }, vehiclePlate: "FGT-2B33",
    rating: 4.9, trips30: 38,
    docs: [
      { type: "CNH", number: "08765432109", expiresAt: "2028-11-20", status: "ok" },
      { type: "ANTT", number: "RNTRC-8843211", expiresAt: "2027-02-12", status: "ok" },
      { type: "ASO", number: "ASO-2026-0118", expiresAt: "2027-01-18", status: "ok" },
      { type: "CRLV", number: "CRLV-FGT2B33", expiresAt: "2026-08-10", status: "ok" },
      { type: "Seguro", number: "APL-883210", expiresAt: "2026-05-01", status: "vencido" },
    ],
  },
  {
    id: "AGR-003", name: "João Silva", phone: "+55 21 97654-3210", cpf: "345.678.901-22",
    bank: { bank: "Santander", agency: "5678", account: "11223-4" }, vehiclePlate: "JKL-9M88",
    rating: 4.6, trips30: 31,
    docs: [
      { type: "CNH", number: "01234567890", expiresAt: "2026-05-05", status: "vencendo" },
      { type: "ANTT", number: "RNTRC-9921100", expiresAt: "2027-08-20", status: "ok" },
      { type: "ASO", number: "ASO-2025-1102", expiresAt: "2026-11-02", status: "ok" },
      { type: "CRLV", number: "CRLV-JKL9M88", expiresAt: "2026-07-22", status: "ok" },
      { type: "Seguro", number: "APL-771122", expiresAt: "2027-03-30", status: "ok" },
    ],
  },
  {
    id: "AGR-004", name: "Marcos Pereira", phone: "+55 41 99876-5432", cpf: "456.789.012-33",
    bank: { bank: "Caixa", agency: "9012", account: "33445-7" }, vehiclePlate: "MNB-7C44",
    rating: 4.4, trips30: 27,
    docs: [
      { type: "CNH", number: "09876543210", expiresAt: "2027-09-10", status: "ok" },
      { type: "ANTT", number: "RNTRC-6671423", expiresAt: "2026-04-28", status: "vencido" },
      { type: "ASO", number: "ASO-2026-0210", expiresAt: "2027-02-10", status: "ok" },
      { type: "CRLV", number: "CRLV-MNB7C44", expiresAt: "2026-10-05", status: "ok" },
      { type: "Seguro", number: "APL-664210", expiresAt: "2026-12-22", status: "ok" },
    ],
  },
  {
    id: "AGR-005", name: "Patrícia Souza", phone: "+55 11 91234-5678", cpf: "567.890.123-44",
    bank: { bank: "Nubank", agency: "0001", account: "98765-4" }, vehiclePlate: "PQR-3D77",
    rating: 5.0, trips30: 51,
    docs: [
      { type: "CNH", number: "07654321098", expiresAt: "2028-01-15", status: "ok" },
      { type: "ANTT", number: "RNTRC-5530988", expiresAt: "2027-11-05", status: "ok" },
      { type: "ASO", number: "ASO-2026-0301", expiresAt: "2027-03-01", status: "ok" },
      { type: "CRLV", number: "CRLV-PQR3D77", expiresAt: "2027-04-18", status: "ok" },
      { type: "Seguro", number: "APL-553098", expiresAt: "2026-08-19", status: "ok" },
    ],
  },
  {
    id: "AGR-006", name: "Lucas Almeida", phone: "+55 19 98765-4321", cpf: "678.901.234-55",
    bank: { bank: "Banco do Brasil", agency: "3456", account: "44556-8" }, vehiclePlate: "STU-5E22",
    rating: 4.7, trips30: 35,
    docs: [
      { type: "CNH", number: "06543210987", expiresAt: "2027-06-22", status: "ok" },
      { type: "ANTT", number: "RNTRC-4420877", expiresAt: "2026-09-14", status: "ok" },
      { type: "ASO", number: "ASO-2025-0820", expiresAt: "2026-08-20", status: "vencendo" },
      { type: "CRLV", number: "CRLV-STU5E22", expiresAt: "2027-01-10", status: "ok" },
      { type: "Seguro", number: "APL-442087", expiresAt: "2026-11-30", status: "ok" },
    ],
  },
];

const drivers = AGREGADOS.map(a => ({ id: a.id, name: a.name, phone: a.phone, plate: a.vehiclePlate }));

const VEHICLE_MODELS: { model: string; type: VehicleData["type"]; hasPlatform: boolean }[] = [
  { model: "VW Delivery 11.180", type: "Truck", hasPlatform: true },
  { model: "Mercedes Accelo 1016", type: "Toco", hasPlatform: true },
  { model: "Iveco Daily 70C17", type: "VUC", hasPlatform: false },
  { model: "Volvo VM 270", type: "Truck", hasPlatform: true },
];

const stages: DeliveryStage[] = ["solicitacao", "solicitacao", "crossdocking", "crossdocking", "preparacao", "preparacao", "execucao", "execucao", "execucao", "concluida", "concluida", "concluida"];
const types: DeliveryType[] = ["entrega", "entrega", "entrega", "coleta", "reentrega", "remessa"];

// Mapping stage -> default operational status (sub-status fino do Kanban)
function defaultOpStatus(stage: DeliveryStage, i: number): OperationalStatus {
  if (stage === "solicitacao") return "entrada_pendente";
  if (stage === "crossdocking") return "programada";
  if (stage === "preparacao") return "programada";
  if (stage === "execucao") return i % 5 === 0 ? "ocorrencia" : "em_rota";
  return i % 4 === 0 ? "faturada" : "entregue";
}

export const OPERATIONAL_STATUS_META: Record<OperationalStatus, { label: string; color: string }> = {
  entrada_pendente: { label: "Entrada Pendente", color: "bg-muted/60 text-muted-foreground border-border" },
  programada: { label: "Programada", color: "bg-info/15 text-info border-info/30" },
  em_rota: { label: "Em Rota", color: "bg-primary/15 text-primary border-primary/30" },
  entregue: { label: "Entregue", color: "bg-success/15 text-success border-success/30" },
  ocorrencia: { label: "Ocorrência", color: "bg-destructive/15 text-destructive border-destructive/30" },
  faturada: { label: "Faturada", color: "bg-secondary/40 text-secondary-foreground border-border" },
};

export const SEFAZ_META: Record<SefazStatus, { label: string; color: string }> = {
  autorizada: { label: "Autorizada", color: "bg-success/15 text-success border-success/30" },
  rejeitada: { label: "Rejeitada", color: "bg-destructive/15 text-destructive border-destructive/30" },
  cancelada: { label: "Cancelada", color: "bg-muted/60 text-muted-foreground border-border" },
  pendente: { label: "Pendente", color: "bg-warning/15 text-warning border-warning/30" },
};

export const SOURCE_META: Record<DataSource, { label: string; color: string }> = {
  totvs_tms: { label: "TOTVS TMS", color: "bg-info/15 text-info border-info/30" },
  make_email: { label: "Make / E-mail", color: "bg-primary/15 text-primary border-primary/30" },
  field_tool: { label: "Ferramenta de Campo", color: "bg-warning/15 text-warning border-warning/30" },
  manual: { label: "Manual", color: "bg-muted/60 text-muted-foreground border-border" },
  api: { label: "API Cliente", color: "bg-success/15 text-success border-success/30" },
};

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

function makeNfe(i: number, valor: number): NfeData {
  return {
    chave: `35260${String(1000000 + i * 7).padStart(7, "0")}550010001${String(100 + i).padStart(9, "0")}1${String(i % 10).padStart(8, "0")}`,
    numero: String(440000 + i),
    serie: "001",
    valor,
    emitidaEm: "05/05/2026 08:12",
    statusSefaz: i % 13 === 0 ? "rejeitada" : "autorizada",
  };
}

function makeCte(i: number, valor: number, stage: DeliveryStage): CteData {
  return {
    chave: `35260${String(2000000 + i * 11).padStart(7, "0")}570010001${String(200 + i).padStart(9, "0")}1${String(i % 10).padStart(8, "0")}`,
    numero: String(880000 + i),
    valor,
    emitidoEm: stage === "concluida" ? "05/05/2026 14:10" : undefined,
    statusSefaz: stage === "concluida" ? "autorizada" : "pendente",
  };
}

function makeVehicle(i: number, stage: DeliveryStage): VehicleData {
  const vm = rand(VEHICLE_MODELS, i);
  return {
    plate: drivers[i % drivers.length].plate,
    model: vm.model,
    type: vm.type,
    hasPlatform: vm.hasPlatform,
    lastPosition: stage === "execucao" ? {
      lat: -23.55 + (i % 10) * 0.01,
      lng: -46.63 + (i % 10) * 0.01,
      timestamp: "há 30 s",
      ignitionOn: i % 4 !== 0,
      speedKmh: i % 4 === 0 ? 0 : 35 + (i % 25),
    } : undefined,
  };
}

function makePod(i: number, recipient: string): PodData {
  return {
    photoUrl: `https://placehold.co/600x400/0a2540/fff?text=POD+${100 + i}`,
    signatureUrl: `https://placehold.co/300x100/fff/0a2540?text=Assinatura`,
    gps: { lat: -23.55 + (i % 10) * 0.01, lng: -46.63 + (i % 10) * 0.01 },
    timestamp: "05/05/2026 14:05",
    pdfUrl: `s3://begur-pod/POD-BGR-${(100 + i).toString().padStart(4, "0")}.pdf`,
    recipientName: recipient,
    recipientDoc: "CPF 123.***.***-09",
  };
}

function makeTimeline(stage: DeliveryStage, i: number): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { time: "08:12", title: "NF-e recebida (Make)", description: "XML extraído do e-mail e validado", type: "system" },
  ];
  if (stage === "solicitacao") return base;
  base.push(
    { time: "09:30", title: "Cross-docking — Análise de frete", description: "Cotação e conferência de carga no CD", type: "analyst" },
    { time: "10:00", title: "Consolidação concluída", description: "Carga consolidada e conferida", type: "system" },
    { time: "10:15", title: "Roteirização concluída", description: `Incluída na viagem TRP-${44200 + i}`, type: "system" },
  );
  if (stage === "crossdocking") return base;
  base.push(
    { time: "10:45", title: "Separação e carregamento", description: "Equipamentos separados e carregados no veículo", type: "analyst" },
    { time: "11:00", title: "Inspeção de carga", description: "Registro fotográfico e conferência final", type: "system" },
  );
  if (stage === "preparacao") return base;
  base.push(
    { time: "11:30", title: "Saiu para entrega", description: "Motorista confirmou partida do CD", type: "driver" },
    { time: "13:42", title: "Chegou ao local", description: "GPS confirmado no endereço", type: "driver" },
  );
  if (stage === "execucao") return base;
  base.push(
    { time: "14:05", title: "POD coletado", description: "Foto + assinatura + GPS registrados pelo app", type: "driver" },
    { time: "14:10", title: "CT-e autorizado pela SEFAZ", description: "TOTVS TMS confirmou emissão", type: "system" },
    { time: "14:30", title: "Feedback do cliente", description: "Avaliação positiva registrada", type: "client" },
    { time: "15:00", title: "Caso encerrado", description: "Concluído pelo analista", type: "analyst" },
  );
  return base;
}

export const DELIVERIES: Delivery[] = Array.from({ length: 32 }).map((_, i) => {
  const client = rand(clients, i);
  const [city, uf] = rand(cities, i * 3);
  const stage = rand(stages, i);
  const type = rand(types, i);
  const driverObj = (stage === "preparacao" || stage === "execucao" || stage === "concluida") ? drivers[i % drivers.length] : undefined;
  const slaStatus = i % 11 === 0 ? "breached" : i % 7 === 0 ? "at_risk" : "on_track";
  const value = 480 + (i * 137) % 4200;
  const itemValor = 8500 + (i * 311) % 24000;
  const opStatus = defaultOpStatus(stage, i);
  const recipient = stage === "concluida" ? "João Pedro" : "";

  return {
    id: `BGR-${(100 + i).toString().padStart(4, "0")}`,
    osNumber: `OS-${(54200 + i).toString()}`,
    viagem: stage !== "solicitacao" ? `TRP-${44200 + i}` : undefined,
    source: rand<DataSource>(["totvs_tms", "make_email", "totvs_tms", "api", "manual"], i),
    client: client.name,
    clientContact: client.contact,
    type,
    stage,
    operationalStatus: opStatus,
    origin: "CD Begur — Barueri/SP",
    destination: `Rua das Flores, 420 — ${city}/${uf}`,
    city,
    uf,
    items: [
      { name: rand(equip, i), qty: 1 + (i % 5), sku: `SKU-${4400 + i}` },
      { name: rand(equip, i + 3), qty: 1 + (i % 3), sku: `SKU-${4400 + i + 3}` },
    ],
    driver: driverObj?.name,
    driverPhone: driverObj?.phone,
    driverId: driverObj?.id,
    vehicle: driverObj ? makeVehicle(i, stage) : undefined,
    nfe: stage !== "solicitacao" || i % 2 === 0 ? makeNfe(i, itemValor) : undefined,
    cte: stage === "execucao" || stage === "concluida" ? makeCte(i, value, stage) : undefined,
    pod: stage === "concluida" ? makePod(i, recipient) : undefined,
    sla: ["4h", "6h", "12h", "24h", "Mesmo dia"][i % 5],
    slaStatus,
    created: ["há 10 min", "há 30 min", "há 1h", "há 2h", "há 4h", "Ontem", "há 2 dias"][i % 7],
    eta: stage === "execucao" ? ["14:30", "15:45", "16:20", "17:00"][i % 4] : undefined,
    value,
    analystId: ["renata", "marcos", "carla"][i % 3],
    timeline: makeTimeline(stage, i),
    occurrences: [],
    recipientName: recipient || undefined,
    feedback: stage === "concluida" && i % 3 === 0 ? "Entrega rápida e sem problemas. Obrigado!" : undefined,
  };
});

// Service Requests (Solicitações)
const requestChannels: RequestChannel[] = ["email", "email", "whatsapp", "email", "api", "whatsapp", "email", "manual"];
const requestStatuses: RequestStatus[] = ["pendente", "pendente", "em_analise", "convertida", "pendente", "em_analise", "recusada", "convertida"];

export const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "SOL-0001",
    channel: "email",
    status: "pendente",
    client: "Heineken",
    subject: "Solicitação de coleta urgente — 15 freezers Lote 4421",
    preview: "Prezados, precisamos agendar a coleta de 15 freezers expositores no CD Jacareí…",
    fullBody: `Prezados,

Precisamos agendar a coleta de 15 freezers expositores no CD Jacareí para amanhã, 05/05.

Detalhes:
- Equipamento: Freezer Expositor Metalfrio VF50F
- Quantidade: 15 unidades
- Local de coleta: CD Jacareí — Rod. Presidente Dutra, km 160
- Janela: 08:00 às 12:00
- Destino: CD Begur Barueri
- Contato local: Fernando Alves (11) 99887-2233

Favor confirmar disponibilidade de veículo com plataforma elevatória.

Atenciosamente,
Marina Costa
Coord. Logística — Heineken Brasil`,
    senderName: "Marina Costa",
    senderEmail: "marina.costa@heineken.com.br",
    receivedAt: "há 15 min",
    items: [{ name: "Freezer Expositor Metalfrio VF50F", qty: 15 }],
    destination: "CD Begur — Barueri/SP",
  },
  {
    id: "SOL-0002",
    channel: "whatsapp",
    status: "pendente",
    client: "Bacio di Latte",
    subject: "Reposição freezers loja Jardins",
    preview: "Oi Begur! Preciso de 3 freezers pra loja Jardins. 2 expositores verticais e 1 ilha…",
    fullBody: `Oi Begur! Preciso de reposição de freezers pra loja Jardins.

2 Expositores Refrigerados Froneri EF300
1 Freezer Ilha Metalfrio NF40

Entregar amanhã de manhã, até 10h. Precisa de instalação no local.

Endereço: Rua Oscar Freire, 890 — Jardins/SP
Contato: Juliana (loja) — (11) 98765-1234

Obrigada!
Camila Ferreira — Bacio di Latte`,
    senderName: "Camila Ferreira",
    senderEmail: "camila@baciodilatte.com.br",
    receivedAt: "há 25 min",
    items: [{ name: "Expositor Refrigerado Froneri EF300", qty: 2 }, { name: "Freezer Ilha Metalfrio NF40", qty: 1 }],
    destination: "Rua Oscar Freire, 890 — São Paulo/SP",
  },
  {
    id: "SOL-0003",
    channel: "email",
    status: "em_analise",
    client: "Seara",
    subject: "Entrega programada — Freezers horizontais para PDVs",
    preview: "Conforme contrato mensal, segue pedido de 20 freezers horizontais DA420 para distribuição…",
    fullBody: `Conforme contrato mensal, segue pedido de 20 freezers horizontais Metalfrio DA420 para distribuição em 5 pontos na Grande SP.

Pedido: PED-88431
Data de entrega: 06/05/2026
Equipamento: Freezer Horizontal Metalfrio DA420

Pontos de entrega:
1. Atacadão Osasco — 5 un
2. Assaí Guarulhos — 4 un
3. Makro Santo André — 3 un
4. Atacadão Campinas — 5 un
5. Assaí Sorocaba — 3 un

Favor confirmar agendamento e veículos com plataforma.

Ricardo Mendes
Gestão de Equipamentos — Seara/JBS`,
    senderName: "Ricardo Mendes",
    senderEmail: "ricardo.mendes@seara.com.br",
    receivedAt: "há 1h",
    items: [{ name: "Freezer Horizontal Metalfrio DA420", qty: 20 }],
    destination: "Múltiplos pontos — Grande SP",
  },
  {
    id: "SOL-0004",
    channel: "email",
    status: "convertida",
    client: "Nestlé",
    subject: "RE: Transferência freezers verticais — CD Cajamar → CD Begur",
    preview: "Confirmamos o envio de 8 freezers verticais Nestlé FV120 para transferência…",
    fullBody: `Confirmamos o envio de 8 freezers verticais Nestlé FV120 para transferência do CD Cajamar para CD Begur.

NF: 44521
Peso total: 1.200kg
Paletizado: Não (equipamentos individuais com embalagem protetora)
Saída prevista: 05/05 às 14:00

Att,
Paulo Barros
Supply Chain — Nestlé Brasil`,
    senderName: "Paulo Barros",
    senderEmail: "paulo.barros@nestle.com.br",
    receivedAt: "há 2h",
    items: [{ name: "Freezer Vertical Nestlé FV120", qty: 8 }],
    destination: "CD Begur — Barueri/SP",
    convertedTo: "BGR-0132",
  },
  {
    id: "SOL-0005",
    channel: "api",
    status: "pendente",
    client: "Natural One",
    subject: "Pedido automático — Refrigeradores para PDVs (lote semanal)",
    preview: "Pedido gerado automaticamente via integração. 12 refrigeradores verticais VB28…",
    fullBody: `[Pedido automático via API — Natural One]

Pedido: AUTO-7832
Equipamento: Refrigerador Vertical Metalfrio VB28
Quantidade: 12 unidades
Destino: CD Atacadão Interlagos
Prazo: D+2
Observação: Equipamentos para campanha promocional em PDVs

Gerado em: 05/05/2026 07:45:00`,
    senderName: "Sistema Natural One",
    senderEmail: "api@naturalone.com.br",
    receivedAt: "há 3h",
    items: [{ name: "Refrigerador Vertical Metalfrio VB28", qty: 12 }],
    destination: "CD Atacadão Interlagos — São Paulo/SP",
  },
  {
    id: "SOL-0006",
    channel: "whatsapp",
    status: "em_analise",
    client: "Metalfrio T1",
    subject: "Instalação de freezer — cliente novo em Campinas",
    preview: "Begur, temos uma instalação de freezer VF55 em Campinas. Cliente novo…",
    fullBody: `Begur, temos uma instalação de freezer VF55 em Campinas. Cliente novo, precisa ser instalado até sexta.

Equipamento: Freezer Metalfrio VF55
Endereço: Av. Norte Sul, 1200 — Campinas/SP
Contato: Sr. Alberto — (19) 99876-5432
Observação: Precisa de 2 ajudantes para descarga

Thiago Nunes — Metalfrio Operações T1`,
    senderName: "Thiago Nunes",
    senderEmail: "thiago.nunes@metalfrio.com.br",
    receivedAt: "há 4h",
    items: [{ name: "Freezer Metalfrio VF55", qty: 1 }],
    destination: "Av. Norte Sul, 1200 — Campinas/SP",
  },
  {
    id: "SOL-0007",
    channel: "email",
    status: "recusada",
    client: "Solar",
    subject: "Cotação para rota Fortaleza-Teresina — Ilhas refrigeradas",
    preview: "Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição de ilhas refrigeradas…",
    fullBody: `Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição de ilhas refrigeradas.

Volume estimado: 30 ilhas/semana
Rota: Fortaleza/CE → Teresina/PI (aprox. 630km)
Equipamento: Ilha Refrigerada Solar IR200
Peso unitário: 85kg

Aguardamos proposta comercial.

Fernanda Lima
Diretora de Logística — Solar Br`,
    senderName: "Fernanda Lima",
    senderEmail: "fernanda.lima@solar.com.br",
    receivedAt: "há 6h",
    items: [{ name: "Ilha Refrigerada Solar IR200", qty: 30 }],
    destination: "Teresina/PI",
    notes: "Fora do escopo operacional atual — encaminhado ao comercial",
  },
  {
    id: "SOL-0008",
    channel: "manual",
    status: "convertida",
    client: "Froneri",
    subject: "Cadastro manual — Reentrega expositor danificado",
    preview: "Reentrega de 2 expositores refrigerados Froneri EF300 devolvidos por avaria no transporte…",
    fullBody: `Cadastro manual pelo analista.

Motivo: Reentrega de 2 expositores refrigerados Froneri EF300 devolvidos por avaria no transporte.
Cliente destino: Supermercado Pão de Açúcar — Moema/SP
Prazo: Mesmo dia
Observação: Equipamentos revisados e testados no CD. Funcionamento OK.`,
    senderName: "Renata Moura (Analista)",
    senderEmail: "renata.moura@begur.com.br",
    receivedAt: "há 8h",
    items: [{ name: "Expositor Refrigerado Froneri EF300", qty: 2 }],
    destination: "Pão de Açúcar Moema — São Paulo/SP",
    convertedTo: "BGR-0128",
  },
];

export const OCCURRENCES_DATA: Occurrence[] = [
  { id: "OCR-1100", deliveryId: "BGR-0107", type: "recusa", severity: "high", description: "Cliente ausente — segunda tentativa", opened: "há 12 min", status: "aberta", owner: "Renata Moura" },
  { id: "OCR-1101", deliveryId: "BGR-0115", type: "atraso", severity: "medium", description: "Tráfego intenso na Marginal Pinheiros", opened: "há 34 min", status: "em_analise", owner: "Marcos Silva" },
  { id: "OCR-1102", deliveryId: "BGR-0103", type: "avaria", severity: "high", description: "Embalagem violada na recepção do CD", opened: "há 1h", status: "aberta", owner: "Carla Santos" },
  { id: "OCR-1103", deliveryId: "BGR-0119", type: "endereco", severity: "low", description: "CEP divergente — novo endereço confirmado pelo cliente", opened: "há 2h", status: "resolvida", owner: "Renata Moura" },
  { id: "OCR-1104", deliveryId: "BGR-0108", type: "reentrega", severity: "medium", description: "Reagendado para amanhã às 09:00", opened: "há 3h", status: "em_analise", owner: "Marcos Silva" },
  { id: "OCR-1105", deliveryId: "BGR-0121", type: "equipamento", severity: "high", description: "Serial divergente do pedido — conferência necessária", opened: "há 5h", status: "aberta", owner: "Carla Santos" },
  { id: "OCR-1106", deliveryId: "BGR-0112", type: "recusa", severity: "medium", description: "Endereço comercial fechado no horário", opened: "há 6h", status: "em_analise", owner: "Renata Moura" },
  { id: "OCR-1107", deliveryId: "BGR-0125", type: "atraso", severity: "low", description: "Veículo com pneu furado — substituição em andamento", opened: "há 8h", status: "resolvida", owner: "Marcos Silva" },
];

export interface AnalystData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  clients: string[];
  stats: {
    abertas: number;
    emExecucao: number;
    concluidas: number;
    ocorrencias: number;
    slaAtRisk: number;
  };
}

export const ANALYSTS: AnalystData[] = [
  {
    id: "renata",
    name: "Renata Moura",
    role: "Analista Sênior",
    avatar: "RM",
    clients: ["Heineken", "Bacio di Latte", "Froneri"],
    stats: { abertas: 8, emExecucao: 14, concluidas: 127, ocorrencias: 3, slaAtRisk: 2 },
  },
  {
    id: "marcos",
    name: "Marcos Silva",
    role: "Analista Pleno",
    avatar: "MS",
    clients: ["Nestlé", "Seara", "Natural One"],
    stats: { abertas: 5, emExecucao: 11, concluidas: 98, ocorrencias: 2, slaAtRisk: 1 },
  },
  {
    id: "carla",
    name: "Carla Santos",
    role: "Analista Pleno",
    avatar: "CS",
    clients: ["Metalfrio T1", "Metalfrio T2", "3L", "Solar"],
    stats: { abertas: 6, emExecucao: 9, concluidas: 112, ocorrencias: 4, slaAtRisk: 0 },
  },
];

export const CUSTOMERS = [
  { name: "3L", segment: "Refrigeração Comercial", orders30: 187, otif: 96.2, sla: "12h", contact: "logistica@3l.com.br" },
  { name: "Bacio di Latte", segment: "Freezers/Expositores", orders30: 312, otif: 98.5, sla: "4h", contact: "ops@baciodilatte.com.br" },
  { name: "Froneri", segment: "Expositores Refrigerados", orders30: 298, otif: 97.1, sla: "6h", contact: "supply@froneri.com.br" },
  { name: "Heineken", segment: "Cervejeiras/Freezers", orders30: 521, otif: 98.8, sla: "6h", contact: "logistica@heineken.com.br" },
  { name: "Metalfrio T1", segment: "Equipamentos Refrigerados", orders30: 145, otif: 94.5, sla: "24h", contact: "operacoes.t1@metalfrio.com.br" },
  { name: "Metalfrio T2", segment: "Equipamentos Refrigerados", orders30: 98, otif: 95.0, sla: "24h", contact: "operacoes.t2@metalfrio.com.br" },
  { name: "Natural One", segment: "Refrigeradores PDV", orders30: 267, otif: 97.8, sla: "Mesmo dia", contact: "entregas@naturalone.com.br" },
  { name: "Nestlé", segment: "Freezers Verticais", orders30: 412, otif: 99.0, sla: "8h", contact: "supply.chain@nestle.com.br" },
  { name: "Seara", segment: "Freezers Horizontais", orders30: 378, otif: 96.4, sla: "12h", contact: "logistica@seara.com.br" },
  { name: "Solar", segment: "Ilhas Refrigeradas", orders30: 445, otif: 97.3, sla: "12h", contact: "distribuicao@solar.com.br" },
];

// =====================================================================
// WMS (somente leitura) — Saldo de equipamentos por SKU/cliente/local
// Polling a cada 15-30 min do TOTVS WMS
// =====================================================================
export interface WmsStock {
  sku: string;
  product: string;
  client: string;
  location: string;       // CD/posição lógica
  onHand: number;
  reserved: number;
  available: number;
  lastMovement: string;
  slowMoving: boolean;    // > 60 dias parado
}

export const WMS_STOCK: WmsStock[] = [
  { sku: "SKU-4400", product: "Freezer Metalfrio VF55", client: "Metalfrio T1", location: "CD Barueri / A-12", onHand: 240, reserved: 38, available: 202, lastMovement: "há 2h", slowMoving: false },
  { sku: "SKU-4401", product: "Freezer Horizontal Metalfrio DA420", client: "Seara", location: "CD Barueri / B-04", onHand: 180, reserved: 60, available: 120, lastMovement: "há 30 min", slowMoving: false },
  { sku: "SKU-4402", product: "Refrigerador Vertical Metalfrio VB28", client: "Natural One", location: "CD Barueri / C-21", onHand: 95, reserved: 12, available: 83, lastMovement: "há 5h", slowMoving: false },
  { sku: "SKU-4403", product: "Cooler Metalfrio CL200", client: "Heineken", location: "CD Barueri / D-08", onHand: 320, reserved: 145, available: 175, lastMovement: "há 15 min", slowMoving: false },
  { sku: "SKU-4404", product: "Freezer Expositor Metalfrio VF50F", client: "Heineken", location: "CD Barueri / D-09", onHand: 88, reserved: 15, available: 73, lastMovement: "há 1h", slowMoving: false },
  { sku: "SKU-4405", product: "Geladeira Comercial Metalfrio VN44", client: "Bacio di Latte", location: "CD Barueri / E-02", onHand: 42, reserved: 8, available: 34, lastMovement: "há 4h", slowMoving: false },
  { sku: "SKU-4406", product: "Cervejeira Metalfrio VN50", client: "Heineken", location: "CD Barueri / D-10", onHand: 156, reserved: 22, available: 134, lastMovement: "há 6h", slowMoving: false },
  { sku: "SKU-4407", product: "Freezer Ilha Metalfrio NF40", client: "Bacio di Latte", location: "CD Barueri / E-05", onHand: 28, reserved: 3, available: 25, lastMovement: "há 8h", slowMoving: false },
  { sku: "SKU-4408", product: "Refrigerador Solar 440L", client: "Solar", location: "CD Barueri / F-11", onHand: 12, reserved: 0, available: 12, lastMovement: "há 72 dias", slowMoving: true },
  { sku: "SKU-4409", product: "Expositor Refrigerado Froneri EF300", client: "Froneri", location: "CD Barueri / G-03", onHand: 64, reserved: 18, available: 46, lastMovement: "há 1h", slowMoving: false },
  { sku: "SKU-4410", product: "Freezer Vertical Nestlé FV120", client: "Nestlé", location: "CD Barueri / H-07", onHand: 110, reserved: 25, available: 85, lastMovement: "há 3h", slowMoving: false },
  { sku: "SKU-4411", product: "Ilha Refrigerada Solar IR200", client: "Solar", location: "CD Barueri / F-14", onHand: 5, reserved: 0, available: 5, lastMovement: "há 95 dias", slowMoving: true },
];

// =====================================================================
// Status das Integrações — exibido no painel operacional
// =====================================================================
export interface IntegrationStatus {
  id: string;
  name: string;
  type: "totvs_tms" | "totvs_wms" | "make" | "field_tool" | "sefaz";
  description: string;
  status: "online" | "degraded" | "offline";
  lastSync: string;
  latencyMs?: number;
  eventsToday?: number;
}

export const INTEGRATIONS: IntegrationStatus[] = [
  { id: "int-totvs-tms", name: "TOTVS TMS", type: "totvs_tms", description: "NF-e, CT-e, frete e contas a pagar", status: "online", lastSync: "há 12 s", latencyMs: 230, eventsToday: 487 },
  { id: "int-totvs-wms", name: "TOTVS WMS", type: "totvs_wms", description: "Saldo, movimentações e inventário (leitura)", status: "online", lastSync: "há 14 min", latencyMs: 410, eventsToday: 12 },
  { id: "int-make", name: "Make (E-mail → OS)", type: "make", description: "Extração de XML de NF-e por e-mail", status: "online", lastSync: "há 3 min", eventsToday: 38 },
  { id: "int-field", name: "Ferramenta de Campo", type: "field_tool", description: "GPS, roteirização e POD", status: "degraded", lastSync: "há 45 s", latencyMs: 1820, eventsToday: 1243 },
  { id: "int-sefaz", name: "SEFAZ", type: "sefaz", description: "Validação fiscal NF-e/CT-e", status: "online", lastSync: "há 1 min", latencyMs: 680, eventsToday: 892 },
];

// =====================================================================
// Conferência de fechamento financeiro de agregados
// (Plataforma calcula valor correto e envia ao TOTVS para pagamento)
// =====================================================================
export interface AgregadoSettlement {
  agregadoId: string;
  agregadoName: string;
  period: string;
  trips: number;
  baseValue: number;
  bonus: number;
  deductions: number;
  finalValue: number;
  totvsValue: number;     // valor lançado no TOTVS para conferência
  diff: number;
  status: "ok" | "divergente" | "pendente";
}

export const AGREGADO_SETTLEMENTS: AgregadoSettlement[] = AGREGADOS.map((a, i) => {
  const base = 4500 + (i * 312) % 3800;
  const bonus = i % 2 === 0 ? 320 : 180;
  const ded = i % 3 === 0 ? 240 : 0;
  const final = base + bonus - ded;
  const totvs = i % 4 === 0 ? final - 100 : final;
  return {
    agregadoId: a.id,
    agregadoName: a.name,
    period: "Abr/2026",
    trips: a.trips30,
    baseValue: base,
    bonus,
    deductions: ded,
    finalValue: final,
    totvsValue: totvs,
    diff: final - totvs,
    status: final === totvs ? "ok" : (i % 5 === 0 ? "pendente" : "divergente"),
  };
});
