// Begur Control Tower — Modelo de dados centrado em Entrega (Case)

export type DeliveryStage = "solicitacao" | "preparacao" | "execucao" | "retorno" | "concluida";
export type DeliveryType = "entrega" | "coleta" | "reentrega" | "remessa";
export type OccurrenceType = "recusa" | "avaria" | "atraso" | "endereco" | "reentrega" | "equipamento";
export type Severity = "low" | "medium" | "high";
export type RequestChannel = "email" | "whatsapp" | "manual" | "api";
export type RequestStatus = "pendente" | "em_analise" | "convertida" | "recusada";

export const STAGE_META: Record<DeliveryStage, { label: string; color: string; order: number }> = {
  solicitacao: { label: "Solicitação", color: "bg-info/15 text-info border-info/30", order: 0 },
  preparacao: { label: "Preparação", color: "bg-warning/15 text-warning border-warning/30", order: 1 },
  execucao: { label: "Em Execução", color: "bg-primary/15 text-primary border-primary/30", order: 2 },
  retorno: { label: "Retorno", color: "bg-destructive/15 text-destructive border-destructive/30", order: 3 },
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

export interface Delivery {
  id: string;
  client: string;
  clientContact: string;
  type: DeliveryType;
  stage: DeliveryStage;
  origin: string;
  destination: string;
  city: string;
  uf: string;
  items: { name: string; qty: number }[];
  driver?: string;
  driverPhone?: string;
  sla: string;
  slaStatus: "on_track" | "at_risk" | "breached";
  created: string;
  eta?: string;
  value: number;
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
  "Cerveja Heineken 600ml (cx)", "Sorvete Froneri 2L", "Freezer Metalfrio VF55", "Suco Natural One 900ml",
  "Gelato Bacio 500ml", "Empanado Seara 400g", "Nescafé Dolce Gusto cx", "Refrigerador Solar 440L",
  "Kibon Magnum cx", "Água de Coco 3L cx", "Pizza Seara Congelada", "Cooler Metalfrio CL200",
];

const drivers = [
  { name: "Carlos Mendes", phone: "+55 11 99821-4410" },
  { name: "Ana Ribeiro", phone: "+55 11 98832-1122" },
  { name: "João Silva", phone: "+55 21 97654-3210" },
  { name: "Marcos Pereira", phone: "+55 41 99876-5432" },
  { name: "Patrícia Souza", phone: "+55 11 91234-5678" },
  { name: "Lucas Almeida", phone: "+55 19 98765-4321" },
];

const stages: DeliveryStage[] = ["solicitacao", "solicitacao", "preparacao", "preparacao", "execucao", "execucao", "execucao", "retorno", "concluida", "concluida", "concluida", "concluida"];
const types: DeliveryType[] = ["entrega", "entrega", "entrega", "coleta", "reentrega", "remessa"];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

function makeTimeline(stage: DeliveryStage, i: number): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { time: "08:12", title: "Solicitação recebida", description: "Via e-mail do cliente", type: "system" },
  ];
  if (stage === "solicitacao") return base;
  base.push(
    { time: "09:30", title: "Dados conferidos", description: "Endereço e itens validados pelo analista", type: "analyst" },
    { time: "10:15", title: "Roteirização concluída", description: `Incluída na viagem TRP-${44200 + i}`, type: "system" },
  );
  if (stage === "preparacao") return base;
  base.push(
    { time: "11:00", title: "Saiu para entrega", description: "Motorista confirmou partida do CD", type: "driver" },
    { time: "13:42", title: "Chegou ao local", description: "GPS confirmado no endereço", type: "driver" },
  );
  if (stage === "execucao") return base;
  if (stage === "retorno") {
    base.push({ time: "14:00", title: "Tentativa sem sucesso", description: "Cliente ausente no local", type: "exception" });
    return base;
  }
  base.push(
    { time: "14:05", title: "Entregue com sucesso", description: "Recebido por João Pedro", type: "driver" },
    { time: "14:10", title: "Comprovante registrado", description: "Foto e assinatura digital", type: "system" },
    { time: "15:00", title: "Caso encerrado", description: "Feedback positivo do cliente", type: "analyst" },
  );
  return base;
}

export const DELIVERIES: Delivery[] = Array.from({ length: 32 }).map((_, i) => {
  const client = rand(clients, i);
  const [city, uf] = rand(cities, i * 3);
  const stage = rand(stages, i);
  const type = rand(types, i);
  const driver = (stage === "execucao" || stage === "retorno" || stage === "concluida") ? rand(drivers, i) : undefined;
  const slaStatus = i % 11 === 0 ? "breached" : i % 7 === 0 ? "at_risk" : "on_track";

  return {
    id: `BGR-${(100 + i).toString().padStart(4, "0")}`,
    client: client.name,
    clientContact: client.contact,
    type,
    stage,
    origin: "CD Begur — Barueri/SP",
    destination: `Rua das Flores, 420 — ${city}/${uf}`,
    city,
    uf,
    items: [
      { name: rand(equip, i), qty: 1 + (i % 5) },
      { name: rand(equip, i + 3), qty: 1 + (i % 3) },
    ],
    driver: driver?.name,
    driverPhone: driver?.phone,
    sla: ["4h", "6h", "12h", "24h", "Mesmo dia"][i % 5],
    slaStatus,
    created: ["há 10 min", "há 30 min", "há 1h", "há 2h", "há 4h", "Ontem", "há 2 dias"][i % 7],
    eta: stage === "execucao" ? ["14:30", "15:45", "16:20", "17:00"][i % 4] : undefined,
    value: 480 + (i * 137) % 4200,
    analystId: ["renata", "marcos", "carla"][i % 3],
    timeline: makeTimeline(stage, i),
    occurrences: stage === "retorno" ? [`OCR-${1100 + i}`] : [],
    recipientName: stage === "concluida" ? "João Pedro" : undefined,
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
    subject: "Solicitação de coleta urgente — Lote 4421",
    preview: "Prezados, precisamos agendar a coleta de 120 caixas de Heineken 600ml no CD Jacareí…",
    fullBody: `Prezados,

Precisamos agendar a coleta de 120 caixas de Heineken 600ml no CD Jacareí para amanhã, 05/05.

Detalhes:
- Produto: Cerveja Heineken 600ml (cx 12un)
- Quantidade: 120 caixas
- Local de coleta: CD Jacareí — Rod. Presidente Dutra, km 160
- Janela: 08:00 às 12:00
- Destino: CD Begur Barueri
- Contato local: Fernando Alves (11) 99887-2233

Favor confirmar disponibilidade.

Atenciosamente,
Marina Costa
Coord. Logística — Heineken Brasil`,
    senderName: "Marina Costa",
    senderEmail: "marina.costa@heineken.com.br",
    receivedAt: "há 15 min",
    items: [{ name: "Cerveja Heineken 600ml (cx)", qty: 120 }],
    destination: "CD Begur — Barueri/SP",
  },
  {
    id: "SOL-0002",
    channel: "whatsapp",
    status: "pendente",
    client: "Bacio di Latte",
    subject: "Reposição loja Jardins — gelatos",
    preview: "Oi Begur! Preciso de reposição pra loja Jardins. 30 caixas de gelato sortido…",
    fullBody: `Oi Begur! Preciso de reposição pra loja Jardins.

30 caixas de gelato sortido (500ml)
15 caixas de picolé premium

Entregar amanhã de manhã, até 10h.

Endereço: Rua Oscar Freire, 890 — Jardins/SP
Contato: Juliana (loja) — (11) 98765-1234

Obrigada!
Camila Ferreira — Bacio di Latte`,
    senderName: "Camila Ferreira",
    senderEmail: "camila@baciodilatte.com.br",
    receivedAt: "há 25 min",
    items: [{ name: "Gelato Bacio 500ml", qty: 30 }, { name: "Picolé Premium cx", qty: 15 }],
    destination: "Rua Oscar Freire, 890 — São Paulo/SP",
  },
  {
    id: "SOL-0003",
    channel: "email",
    status: "em_analise",
    client: "Seara",
    subject: "Entrega programada — Empanados congelados",
    preview: "Conforme contrato mensal, segue pedido de 200 caixas de empanado Seara 400g…",
    fullBody: `Conforme contrato mensal, segue pedido de 200 caixas de empanado Seara 400g para distribuição em 5 pontos na Grande SP.

Pedido: PED-88431
Data de entrega: 06/05/2026
Temperatura: -18°C (congelado)

Pontos de entrega:
1. Atacadão Osasco — 50cx
2. Assaí Guarulhos — 40cx
3. Makro Santo André — 35cx
4. Atacadão Campinas — 45cx
5. Assaí Sorocaba — 30cx

Favor confirmar agendamento e veículos refrigerados disponíveis.

Ricardo Mendes
Gestão de Pedidos — Seara/JBS`,
    senderName: "Ricardo Mendes",
    senderEmail: "ricardo.mendes@seara.com.br",
    receivedAt: "há 1h",
    items: [{ name: "Empanado Seara 400g", qty: 200 }],
    destination: "Múltiplos pontos — Grande SP",
  },
  {
    id: "SOL-0004",
    channel: "email",
    status: "convertida",
    client: "Nestlé",
    subject: "RE: Transferência Nescafé — CD Cajamar → CD Begur",
    preview: "Confirmamos o envio de 80 caixas Nescafé Dolce Gusto para transferência…",
    fullBody: `Confirmamos o envio de 80 caixas Nescafé Dolce Gusto para transferência do CD Cajamar para CD Begur.

NF: 44521
Peso total: 960kg
Paletizado: Sim (4 pallets)
Saída prevista: 05/05 às 14:00

Att,
Paulo Barros
Supply Chain — Nestlé Brasil`,
    senderName: "Paulo Barros",
    senderEmail: "paulo.barros@nestle.com.br",
    receivedAt: "há 2h",
    items: [{ name: "Nescafé Dolce Gusto cx", qty: 80 }],
    destination: "CD Begur — Barueri/SP",
    convertedTo: "BGR-0132",
  },
  {
    id: "SOL-0005",
    channel: "api",
    status: "pendente",
    client: "Natural One",
    subject: "Pedido automático — Suco 900ml (lote semanal)",
    preview: "Pedido gerado automaticamente via integração. 150 caixas Suco Natural One 900ml…",
    fullBody: `[Pedido automático via API — Natural One]

Pedido: AUTO-7832
Produto: Suco Natural One 900ml (Laranja, Uva, Limonada)
Quantidade: 150 caixas (50 de cada sabor)
Destino: CD Atacadão Interlagos
Prazo: D+2
Temperatura: Refrigerado (2-8°C)

Gerado em: 05/05/2026 07:45:00`,
    senderName: "Sistema Natural One",
    senderEmail: "api@naturalone.com.br",
    receivedAt: "há 3h",
    items: [{ name: "Suco Natural One 900ml", qty: 150 }],
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
    subject: "Cotação para rota Fortaleza-Teresina",
    preview: "Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição…",
    fullBody: `Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição de refrigerantes.

Volume estimado: 3 carretas/semana
Rota: Fortaleza/CE → Teresina/PI (aprox. 630km)
Produto: Refrigerantes diversos (Coca-Cola, Fanta, Sprite)
Temperatura: Ambiente

Aguardamos proposta comercial.

Fernanda Lima
Diretora de Logística — Solar Br`,
    senderName: "Fernanda Lima",
    senderEmail: "fernanda.lima@solar.com.br",
    receivedAt: "há 6h",
    items: [{ name: "Refrigerador Solar 440L", qty: 3 }],
    destination: "Teresina/PI",
    notes: "Fora do escopo operacional atual — encaminhado ao comercial",
  },
  {
    id: "SOL-0008",
    channel: "manual",
    status: "convertida",
    client: "Froneri",
    subject: "Cadastro manual — Reentrega sorvetes devolvidos",
    preview: "Reentrega de 45 caixas de sorvete Froneri 2L devolvidas por avaria na embalagem…",
    fullBody: `Cadastro manual pelo analista.

Motivo: Reentrega de 45 caixas de sorvete Froneri 2L devolvidas por avaria na embalagem externa.
Cliente destino: Supermercado Pão de Açúcar — Moema/SP
Prazo: Mesmo dia
Temperatura: -18°C (congelado)
Observação: Embalagens substituídas no CD. Produto OK para venda.`,
    senderName: "Renata Moura (Analista)",
    senderEmail: "renata.moura@begur.com.br",
    receivedAt: "há 8h",
    items: [{ name: "Sorvete Froneri 2L", qty: 45 }],
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
  { name: "3L", segment: "Bebidas", orders30: 187, otif: 96.2, sla: "12h", contact: "logistica@3l.com.br" },
  { name: "Bacio di Latte", segment: "Gelatos/Sorvetes", orders30: 312, otif: 98.5, sla: "4h", contact: "ops@baciodilatte.com.br" },
  { name: "Froneri", segment: "Sorvetes/Congelados", orders30: 298, otif: 97.1, sla: "6h", contact: "supply@froneri.com.br" },
  { name: "Heineken", segment: "Bebidas", orders30: 521, otif: 98.8, sla: "6h", contact: "logistica@heineken.com.br" },
  { name: "Metalfrio T1", segment: "Equipamentos Refrigerados", orders30: 145, otif: 94.5, sla: "24h", contact: "operacoes.t1@metalfrio.com.br" },
  { name: "Metalfrio T2", segment: "Equipamentos Refrigerados", orders30: 98, otif: 95.0, sla: "24h", contact: "operacoes.t2@metalfrio.com.br" },
  { name: "Natural One", segment: "Sucos/Bebidas", orders30: 267, otif: 97.8, sla: "Mesmo dia", contact: "entregas@naturalone.com.br" },
  { name: "Nestlé", segment: "Alimentos/Bebidas", orders30: 412, otif: 99.0, sla: "8h", contact: "supply.chain@nestle.com.br" },
  { name: "Seara", segment: "Alimentos Congelados", orders30: 378, otif: 96.4, sla: "12h", contact: "logistica@seara.com.br" },
  { name: "Solar", segment: "Bebidas/Distribuição", orders30: 445, otif: 97.3, sla: "12h", contact: "distribuicao@solar.com.br" },
];
