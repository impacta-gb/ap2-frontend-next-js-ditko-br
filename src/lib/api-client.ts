import {
  ApiError,
  ApiListResponse,
  CreateItemRequest,
  CreateResponsavelRequest,
  Item,
  PatchItemRequest,
  PatchResponsavelRequest,
  Responsavel,
  UpdateItemRequest,
  UpdateResponsavelRequest,
  Local,
  CreateLocalRequest,
  PatchLocalRequest,
  UpdateLocalRequest,
  Reclamante,
  UpdateReclamanteRequest,
  PatchReclamanteRequest
} from "../types";

const API_URLS = {
  ITEM: "/api/proxy/item",
  LOCAL: "/api/proxy/local",
  RESPONSAVEL: "/api/proxy/responsavel",
  DEVOLUCAO: "/api/proxy/devolucao",
  RECLAMANTE: "/api/proxy/reclamante",
};

class ApiClient {
  private itemPath(path = ""): string {
    const normalizedBase = API_URLS.ITEM.replace(/\/$/, "");
    return `${normalizedBase}/api/v1/items${path}`;
  }

  private responsavelPath(path = ""): string {
    const normalizedBase = API_URLS.RESPONSAVEL.replace(/\/$/, "");
    return `${normalizedBase}/api/v1/responsaveis${path}`;
  }

  private localPath(path = ""): string {
    const normalizedBase = API_URLS.LOCAL.replace(/\/$/, "");
    return `${normalizedBase}/api/v1/locais${path}`;
  }

  private devolucaoPath(path = ""): string {
    const normalizedBase = API_URLS.DEVOLUCAO.replace(/\/$/, "");
    return `${normalizedBase}/api/v1/devolucoes${path}`;
  }

  private reclamantePath(path = ""): string {
    const normalizedBase = API_URLS.RECLAMANTE.replace(/\/$/, "");
    return `${normalizedBase}/api/v1/reclamantes${path}`;
  }

  private extractItem(payload: unknown): Item {
    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;

      if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
        return obj.data as Item;
      }

      if (
        obj.item &&
        typeof obj.item === "object" &&
        !Array.isArray(obj.item)
      ) {
        return obj.item as Item;
      }
    }

    return payload as Item;
  }
  private extractResponsavel(payload: unknown): Responsavel {
    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;

      if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
        return obj.data as Responsavel;
      }

      if (
        obj.responsavel &&
        typeof obj.responsavel === "object" &&
        !Array.isArray(obj.responsavel)
      ) {
        return obj.responsavel as Responsavel;
      }
    }

    return payload as Responsavel;
  }

  private extractLocal(payload: unknown): Local {
    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;

      if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
        return obj.data as Local;
      }

      if (
        obj.local &&
        typeof obj.local === "object" &&
        !Array.isArray(obj.local)
      ) {
        return obj.local as Local;
      }
    }

    return payload as Local;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}`,
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.details = errorData.details;
      } catch {
      }

      throw error;
    }

    const text = await response.text();
    if (!text) {
      return null as unknown as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      return text as unknown as T;
    }
  }

  // Item endpoints
  async getItems(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(`${this.itemPath('/')}?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getItemById(id: string): Promise<any> {
    return this.request(this.itemPath(`/${id}`), { method: 'GET' });
  }

  async createItem(data: any): Promise<any> {
    return this.request(this.itemPath('/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: any): Promise<any> {
    return this.request(this.itemPath(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patchItem(id: string, data: PatchItemRequest): Promise<Item> {
    return this.request(this.itemPath(`/${id}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateItemStatus(id: string, status: string): Promise<Item> {
    return this.request(this.itemPath(`/${id}`), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteItem(id: string): Promise<void> {
    return this.request(this.itemPath(`/${id}`), { method: 'DELETE' });
  }

  // Local endpoints
  async getLocais(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${this.localPath("/")}?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getLocalById(id: string): Promise<any> {
    return this.request(this.localPath(`/${id}`), { method: "GET" });
  }

  async createLocal(data: CreateLocalRequest): Promise<Local> {
    return this.request(this.localPath('/'), {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patchLocal(
    id: string,
    data: PatchLocalRequest
  ): Promise<Local> {
    return this.request(this.localPath(`/${id}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteLocal(id: string): Promise<void> {
    return this.request(this.localPath(`/${id}`), {
      method: "DELETE",
    });
  }

  // Responsável endpoints
  async getResponsaveis(page = 1, limit = 10): Promise<ApiListResponse<Responsavel>> {
    return this.request(
      `${this.responsavelPath("/")}?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getResponsavelById(id: string): Promise<Responsavel> {
    const response = await this.request<unknown>(this.responsavelPath(`/${id}`), {
      method: "GET",
    });
    return this.extractResponsavel(response);
  }

  async getResponsaveisByAtivo(value: boolean): Promise<Responsavel[]> {
    return this.request(this.responsavelPath(`/ativo/${value}`), {
      method: "GET",
    });
  }

  async createResponsavel(data: CreateResponsavelRequest): Promise<Responsavel> {
    return this.request(this.responsavelPath("/"), {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateResponsavel(
    id: string,
    data: UpdateResponsavelRequest
  ): Promise<Responsavel> {
    return this.request(this.responsavelPath(`/${id}`), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patchResponsavel(
    id: string,
    data: PatchResponsavelRequest
  ): Promise<Responsavel> {
    return this.request(this.responsavelPath(`/${id}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateResponsavelStatus(id: string, ativo: boolean): Promise<Responsavel> {
    return this.request(this.responsavelPath(`/${id}/status`), {
      method: "PATCH",
      body: JSON.stringify({ ativo }),
    });
  }

  async deleteResponsavel(id: string): Promise<void> {
    return this.request(this.responsavelPath(`/${id}`), {
      method: "DELETE",
    });
  }

  // Devolução endpoints
  async getDevolucoes(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(`${this.devolucaoPath('/')}?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getDevolutionById(id: string): Promise<any> {
    return this.request(this.devolucaoPath(`/${id}`), { method: 'GET' });
  }

  async createDevolucao(data: any): Promise<any> {
    return this.request(this.devolucaoPath('/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDevolucao(id: string, data: any): Promise<any> {
    return this.request(this.devolucaoPath(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDevolucao(id: string): Promise<void> {
    return this.request(this.devolucaoPath(`/${id}`), {
      method: 'DELETE',
    });
  }

  // Reclamante endpoints
  async getReclamantes(skip = 0, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.RECLAMANTE}/api/v1/reclamantes/?skip=${skip}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getReclamanteById(id: string): Promise<any> {
    return this.request(`${API_URLS.RECLAMANTE}/api/v1/reclamantes/${id}`, {
      method: "GET",
    });
  }

  async createReclamante(data: any): Promise<any> {
    return this.request(`${API_URLS.RECLAMANTE}/api/v1/reclamantes/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

    async updateReclamante(
    id: string,
    data: UpdateReclamanteRequest
  ): Promise<Reclamante> {
    return this.request(this.reclamantePath(`/${id}`), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patchReclamante(
    id: string,
    data: PatchReclamanteRequest
  ): Promise<Reclamante> {
    return this.request(this.reclamantePath(`/${id}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteReclamante(id: string): Promise<void> {
    return this.request(this.reclamantePath(`/${id}`), {
      method: "DELETE",
    });
  }

  
}

export const apiClient = new ApiClient();
