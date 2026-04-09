/**
 * Formata uma data ISO para formato legível
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Formata uma data e hora ISO para formato legível
 */
export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Mascara para telefone em tempo real
 */
export const phoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Obtém a cor do badge de status
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    disponível: "bg-green-100 text-green-800",
    devolvido: "bg-blue-100 text-blue-800",
    pendente: "bg-yellow-100 text-yellow-800",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

/**
 * Traduz status para português
 */
export const translateStatus = (status: string): string => {
  const translations: Record<string, string> = {
    disponível: "Disponível",
    devolvido: "Devolvido",
    pendente: "Pendente",
  };
  return translations[status.toLowerCase()] || status;
};

/**
 * Classe utilitária para tratamento de erros
 */
export class ApiErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      if ("message" in err) {
        return String(err.message);
      }
    }

    return "Ocorreu um erro desconhecido";
  }
}
