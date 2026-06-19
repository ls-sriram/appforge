/**
 * ─────────────────────────────────────────────────────────────────
 * API CLIENT — HTTP client for the AppForge backend.
 *
 * Handles:
 *   - Cookie persistence (session cookies for auth)
 *   - Base URL configuration
 *   - Request/response interceptors
 *   - Error normalization
 *
 * Controllers call services. Services use this client.
 * Views never know this exists.
 * ─────────────────────────────────────────────────────────────────
 */
import { BUILD_APP_ID } from "../../generated/build-app-config";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  ok: true;
  status: number;
  data: T;
}

export interface ApiError {
  ok: false;
  status: number;
  error: string;
  code?: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export class TimeoutError extends ApiRequestError {
  constructor(message: string = "Request timed out. Check backend connectivity and try again.") {
    super(message, 0, "TIMEOUT");
    this.name = "TimeoutError";
  }
}

export class NetworkError extends ApiRequestError {
  constructor(message: string = "Network error. Check your connection.") {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

// ─── Configuration ──────────────────────────────────────────────

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export interface RequestConfig {
  method: HttpMethod;
  path: string;
  body?: unknown;
  headers?: HeadersInit;
  timeoutMs?: number;
}

interface RequestSuccess<T> {
  data: T;
  status: number;
}

// ─── Client ─────────────────────────────────────────────────────

class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private apiPrefix: string;

  constructor(baseUrl: string = BASE_URL, timeoutMs: number = 12000) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.timeoutMs = timeoutMs;
    this.apiPrefix = this.baseUrl.endsWith("/api") ? "/v1" : "/api/v1";
  }

  async requestOrThrow<T>(config: RequestConfig): Promise<RequestSuccess<T>> {
    const {
      method,
      path,
      body,
      headers,
      timeoutMs,
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeoutMs ?? this.timeoutMs,
    );

    const url = this.buildUrl(path);
    try {

      console.debug("[api] request:start", {
        method,
        path,
        url,
        hasBody: body !== undefined,
      });

      const requestHeaders: Record<string, string> = {
        "X-App-Id": BUILD_APP_ID,
      };
      if (headers) {
        const flattened = new Headers(headers);
        flattened.forEach((value, key) => {
          requestHeaders[key] = value;
        });
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: "include",
        signal: controller.signal,
      };

      if (body instanceof FormData) {
        options.body = body;
      } else if (body !== undefined) {
        requestHeaders["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      console.debug("[api] request:response", {
        method,
        url,
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const text = await response.text();
        const ngrokErrorCode = response.headers.get("ngrok-error-code");

        if (ngrokErrorCode) {
          throw new ApiRequestError(
            "Backend tunnel is offline. Restart ngrok for the backend and try again.",
            response.status,
            ngrokErrorCode,
          );
        }

        let message = text;

        try {
          const json = JSON.parse(text);
          message = json.error || json.message || text;
        } catch {
          if (
            text.trimStart().startsWith("<!DOCTYPE html") ||
            text.trimStart().startsWith("<html")
          ) {
            message = `HTTP ${response.status}. Backend returned a non-JSON error page.`;
          }
        }

        throw new ApiRequestError(
          message || `HTTP ${response.status}`,
          response.status,
        );
      }

      if (response.status === 204) {
        return { data: undefined as T, status: response.status };
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        return { data: (await response.json()) as T, status: response.status };
      }

      return { data: (await response.text()) as T, status: response.status };
    } catch (err: unknown) {
      console.error("[api] request:exception", {
        method,
        path,
        url,
        error: err instanceof Error ? err.message : String(err),
      });

      if (err instanceof Error && err.name === "AbortError") {
        throw new TimeoutError();
      }

      if (err instanceof ApiRequestError) {
        throw err;
      }

      throw new NetworkError(
        err instanceof Error
          ? err.message
          : "Network error. Check your connection.",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async request<T>(config: RequestConfig): Promise<ApiResult<T>> {
    try {
      const { data, status } = await this.requestOrThrow<T>(config);
      return {
        ok: true,
        status,
        data,
      };
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        return {
          ok: false,
          status: err.status,
          error: err.message,
          code: err.code,
        };
      }
      return {
        ok: false,
        status: 0,
        error: err instanceof Error ? err.message : "Network error. Check your connection.",
      };
    }
  }

  async get<T>(path: string): Promise<ApiResult<T>> {
    return this.request<T>({
      method: "GET",
      path,
    });
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>({
      method: "POST",
      path,
      body,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>({
      method: "PUT",
      path,
      body,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>({
      method: "PATCH",
      path,
      body,
    });
  }

  async delete<T>(path: string): Promise<ApiResult<T>> {
    return this.request<T>({
      method: "DELETE",
      path,
    });
  }

  buildUrl(path: string): string {
    return `${this.baseUrl}${this.normalizePath(path)}`;
  }

  private normalizePath(path: string): string {
    if (!path.startsWith("/")) {
      return `/${path}`;
    }

    if (path.startsWith("/api/") || path.startsWith("/v1/")) {
      return path;
    }

    return `${this.apiPrefix}${path}`;
  }
}

export const api = new ApiClient();
