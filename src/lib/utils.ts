/**
 * Formata uma data ISO para formato legível
 * Suporta formatos: ISO, timestamp, DD/MM/YYYY, YYYY-MM-DD, etc
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date || typeof date !== "string" || date.trim() === "") {
    return "Não informado";
  }

  let parsed: Date | null = null;

  // Tentar parsing de ISO
  const isoDate = new Date(date);
  if (!Number.isNaN(isoDate.getTime())) {
    parsed = isoDate;
  }

  // Se falhar, tentar outros formatos
  if (!parsed) {
    // Tentar formato DD/MM/YYYY
    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})/;
    const ddmmyyyyMatch = date.match(ddmmyyyyRegex);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  }

  // Se ainda não conseguiu, tentar formato YYYY-MM-DD
  if (!parsed) {
    const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const yyyymmddMatch = date.match(yyyymmddRegex);
    if (yyyymmddMatch) {
      const [, year, month, day] = yyyymmddMatch;
      parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  }

  // Se ainda falhar, retornar "Não informado"
  if (!parsed || Number.isNaN(parsed.getTime())) {
    console.warn(`Formato de data não reconhecido: "${date}"`);
    return "Não informado";
  }

  return parsed.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Formata uma data e hora ISO para formato legível
 * Suporta formatos: ISO, timestamp, DD/MM/YYYY HH:mm, etc
 */
export const formatDateTime = (date: string | null | undefined): string => {
  if (!date || typeof date !== "string" || date.trim() === "") {
    return "Não informado";
  }

  let parsed: Date | null = null;

  // Tentar parsing de ISO
  const isoDate = new Date(date);
  if (!Number.isNaN(isoDate.getTime())) {
    parsed = isoDate;
  }

  // Se falhar, tentar outros formatos
  if (!parsed) {
    // Tentar formato DD/MM/YYYY HH:mm:ss
    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/;
    const ddmmyyyyMatch = date.match(ddmmyyyyRegex);
    if (ddmmyyyyMatch) {
      const [, day, month, year, hours, minutes, seconds] = ddmmyyyyMatch;
      parsed = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds || "0")
      );
    }
  }

  // Se ainda não conseguiu, tentar formato YYYY-MM-DD
  if (!parsed) {
    const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/;
    const yyyymmddMatch = date.match(yyyymmddRegex);
    if (yyyymmddMatch) {
      const [, year, month, day, hours = "00", minutes = "00", seconds = "00"] = yyyymmddMatch;
      parsed = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
    }
  }

  // Se ainda falhar, retornar "Não informado"
  if (!parsed || Number.isNaN(parsed.getTime())) {
    console.warn(`Formato de data não reconhecido: "${date}"`);
    return "Não informado";
  }

  return parsed.toLocaleDateString("pt-BR", {
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
  if (!phone || typeof phone !== "string") {
    return "Telefone não informado";
  }

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
 * Normaliza status do backend para os valores do frontend
 */
export const normalizeItemStatus = (status: string | undefined): string => {
  if (!status || typeof status !== 'string') {
    return '';
  }

  const normalized = status.toLowerCase();
  if (normalized === 'disponivel') {
    return 'disponível';
  }
  if (normalized === 'em_analise' || normalized === 'em-analise') {
    return 'pendente';
  }

  return normalized;
};

/**
 * Converte status do frontend para o formato esperado pelo backend
 */
export const serializeItemStatus = (status: string | undefined): string | undefined => {
  const normalizedStatus = normalizeItemStatus(status);

  if (!normalizedStatus) {
    return undefined;
  }

  if (normalizedStatus === 'pendente') {
    return 'em_analise';
  }

  return normalizedStatus;
};

/**
 * Obtém a cor do badge de status
 */
export const getStatusColor = (status: string | undefined): string => {
  const normalizedStatus = normalizeItemStatus(status);

  if (!normalizedStatus) {
    return "bg-gray-100 text-gray-800";
  }
  
  const colors: Record<string, string> = {
    disponível: "bg-green-100 text-green-800",
    devolvido: "bg-blue-100 text-blue-800",
    pendente: "bg-orange-100 text-orange-800",
  };
  return colors[normalizedStatus] || "bg-gray-100 text-gray-800";
};

/**
 * Traduz status para português
 */
export const translateStatus = (status: string | undefined): string => {
  const normalizedStatus = normalizeItemStatus(status);

  if (!normalizedStatus) {
    return 'Desconhecido';
  }
  
  const translations: Record<string, string> = {
    disponível: "Disponível",
    devolvido: "Devolvido",
    pendente: "Pendente",
  };
  return translations[normalizedStatus] || status;
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
