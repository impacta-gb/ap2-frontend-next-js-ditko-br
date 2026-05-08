// Item Types
export interface Item {
  id: string;
  nome: string;
  categoria: string;
  data_encontro: string;
  descricao: string;
  status: ItemStatus;
  local_id: string;
  responsavel_id: string;
  local?: Local;
  responsavel?: Responsavel;
  devolucao?: Devolucao;
  criado_em: string;
  atualizado_em: string;
}

export type ItemStatus = "disponível" | "devolvido" | "pendente";

// Local Types
export interface Local {
  id: string;
  tipo: string;
  descricao: string;
  bairro: string;
  criado_em: string;
  atualizado_em: string;
}

// Responsável Types
export interface Responsavel {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// Devolução Types
export interface Devolucao {
  id: string;
  item_id: string;
  reclamante_id: string;
  data_devolucao: string;
  observacao: string;
  item?: Item;
  reclamante?: Reclamante;
  criado_em: string;
  atualizado_em: string;
}

// Reclamante Types
export interface Reclamante {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  criado_em: string;
  atualizado_em: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// Form Types
export interface CreateItemRequest {
  nome: string;
  categoria: string;
  data_encontro: string;
  descricao: string;
  local_id: string;
  responsavel_id: string;
}

export interface CreateLocalRequest {
  tipo: string;
  bairro: string;
  descricao: string;
}

export interface UpdateLocalRequest {
  tipo: string;
  bairro: string;
  descricao: string;
}

export interface PatchLocalRequest{
  tipo: string;
  bairro: string;
  descricao: string;
}


export interface CreateDevolucaoRequest {
  item_id: string;
  reclamante_id: string;
  data_devolucao: string;
  observacao: string;
}

export interface CreateReclamanteRequest {
  nome: string;
  documento: string;
  telefone: string;
}

export interface CreateResponsavelRequest {
  nome: string;
  cargo: string;
  telefone: string;
}

export interface UpdateResponsavelRequest {
  nome: string;
  cargo: string;
  telefone: string;
}

export interface PatchResponsavelRequest {
  nome?: string;
  cargo?: string;
  telefone?: string;
}
