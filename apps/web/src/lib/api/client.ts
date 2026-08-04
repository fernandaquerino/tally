/**
 * Cliente HTTP único do web (AGENTS §12: não espalhar `fetch` cru).
 *
 * - Sempre envia cookies (`credentials: "include"`) — a sessão vive em cookies
 *   httpOnly definidos pela API (ADR-0008).
 * - Desempacota o envelope `{ data }` e normaliza erros `{ error }` da API.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, error: ApiErrorShape) {
    super(error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Evita loop de refresh nos próprios endpoints de auth. */
  skipRefresh?: boolean;
}

/** Endpoints que nunca devem disparar refresh silencioso. */
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, skipRefresh, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Access token de 15min expirou? Tenta refresh rotativo uma vez e repete.
  if (
    response.status === 401 &&
    !skipRefresh &&
    !NO_REFRESH_PATHS.includes(path) &&
    (await tryRefresh())
  ) {
    return apiFetch<T>(path, { ...options, skipRefresh: true });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = isEnvelopeError(payload)
      ? payload.error
      : { code: "UNKNOWN", message: "Erro inesperado." };
    throw new ApiError(response.status, error);
  }

  return (payload as { data: T }).data;
}

/** Chama o endpoint de rotação; true se a sessão foi renovada. */
async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

function isEnvelopeError(
  payload: unknown,
): payload is { error: ApiErrorShape } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error: unknown }).error === "object"
  );
}
