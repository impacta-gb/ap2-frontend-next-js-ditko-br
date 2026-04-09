import { ApiError, ApiResponse, ApiListResponse } from "../types";

const API_URLS = {
  ITEM: process.env.NEXT_PUBLIC_API_ITEM_URL || "http://localhost:8001",
  LOCAL: process.env.NEXT_PUBLIC_API_LOCAL_URL || "http://localhost:8002",
  RESPONSAVEL:
    process.env.NEXT_PUBLIC_API_RESPONSAVEL_URL || "http://localhost:8003",
  DEVOLUCAO: process.env.NEXT_PUBLIC_API_DEVOLUCAO_URL || "http://localhost:8004",
  RECLAMANTE:
    process.env.NEXT_PUBLIC_API_RECLAMANTE_URL || "http://localhost:8005",
};

class ApiClient {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultHeaders = {
      "Content-Type": "application/json",
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
        // Continue with default error message
      }

      throw error;
    }

    return response.json();
  }

  // Item endpoints
  async getItems(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.ITEM}/items?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getItemById(id: string): Promise<any> {
    return this.request(`${API_URLS.ITEM}/items/${id}`, { method: "GET" });
  }

  async createItem(data: any): Promise<any> {
    return this.request(`${API_URLS.ITEM}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: any): Promise<any> {
    return this.request(`${API_URLS.ITEM}/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string): Promise<void> {
    return this.request(`${API_URLS.ITEM}/items/${id}`, { method: "DELETE" });
  }

  // Local endpoints
  async getLocais(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.LOCAL}/locais?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getLocalById(id: string): Promise<any> {
    return this.request(`${API_URLS.LOCAL}/locais/${id}`, { method: "GET" });
  }

  async createLocal(data: any): Promise<any> {
    return this.request(`${API_URLS.LOCAL}/locais`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Responsável endpoints
  async getResponsaveis(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.RESPONSAVEL}/responsaveis?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getResponsavelById(id: string): Promise<any> {
    return this.request(`${API_URLS.RESPONSAVEL}/responsaveis/${id}`, {
      method: "GET",
    });
  }

  async createResponsavel(data: any): Promise<any> {
    return this.request(`${API_URLS.RESPONSAVEL}/responsaveis`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Devolução endpoints
  async getDevolucoes(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.DEVOLUCAO}/devolucoes?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getDevolutionById(id: string): Promise<any> {
    return this.request(`${API_URLS.DEVOLUCAO}/devolucoes/${id}`, {
      method: "GET",
    });
  }

  async createDevolucao(data: any): Promise<any> {
    return this.request(`${API_URLS.DEVOLUCAO}/devolucoes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Reclamante endpoints
  async getReclamantes(page = 1, limit = 10): Promise<ApiListResponse<any>> {
    return this.request(
      `${API_URLS.RECLAMANTE}/reclamantes?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
  }

  async getReclamanteById(id: string): Promise<any> {
    return this.request(`${API_URLS.RECLAMANTE}/reclamantes/${id}`, {
      method: "GET",
    });
  }

  async createReclamante(data: any): Promise<any> {
    return this.request(`${API_URLS.RECLAMANTE}/reclamantes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
