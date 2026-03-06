import type { ApiError, RefreshResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL  not defined.');
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  skipRefresh?: boolean;
}

// ─── Token refresh helpers ────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

function getStoreState() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useStore } = require('@/store');
  return useStore.getState();
}

async function tryRefreshToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const state = getStoreState();
      const rt = state.refreshToken;
      if (!rt) return null;

      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });

      if (!res.ok) return null;

      const data: RefreshResponse = await res.json();
      state.refreshSession && state.refreshSession();
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core request ─────────────────────────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, skipRefresh = false } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipRefresh && token) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return request<T>(endpoint, { ...options, token: newToken, skipRefresh: true });
    }
  }

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      message: data?.message ?? 'An unexpected error occurred.',
      statusCode: res.status,
    };
    throw error;
  }

  return data as T;
}

// Convenience wrappers
export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'POST', body, token }),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PUT', body, token }),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PATCH', body, token }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};
