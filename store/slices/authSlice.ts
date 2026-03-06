import type { StateCreator } from 'zustand';
import type { User, LoginPayload, RegisterPayload, ApiError, RefreshResponse } from '@/types';
import { api } from '@/lib/api';
import type { AuthResponse } from '@/types';

const TOKEN_COOKIE = 'hl_token';


function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ─── Slice Types ──────────────────────────────────────────────────────────────

export interface AuthSlice {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<boolean>;
}

// ─── Auth Slice ───────────────────────────────────────────────────────────────

import type { UserProfile, AdminProfile } from '@/types';
interface WithProfile { profile: UserProfile | null; adminProfile: AdminProfile | null; }

export const createAuthSlice: StateCreator<AuthSlice & WithProfile, [], [], AuthSlice> = (set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<AuthResponse>('/auth/login', payload);
      setCookie(TOKEN_COOKIE, data.accessToken);
      set({
        user: data.user,
        token: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: (err as ApiError).message });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.post<{ message: string }>('/auth/register', payload);
      const data = await api.post<AuthResponse>('/auth/login', {
        email: payload.email,
        password: payload.password,
      });
      setCookie(TOKEN_COOKIE, data.accessToken);
      set({
        user: data.user,
        token: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: (err as ApiError).message });
    }
  },

  logout: async () => {
    const rt = get().refreshToken;
    const tk = get().token;
    try {
      if (rt) {
        await api.post<{ message: string }>('/auth/logout', { refreshToken: rt }, tk ?? undefined);
      }
    } catch {
    }
    deleteCookie(TOKEN_COOKIE);
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      profile: null,
      adminProfile: null,
    });
  },

  clearError: () => set({ error: null }),

  refreshSession: async () => {
    const rt = get().refreshToken;
    if (!rt) return false;

    try {
      const data = await api.post<RefreshResponse>('/auth/refresh', { refreshToken: rt });
      setCookie(TOKEN_COOKIE, data.accessToken);
      set({ token: data.accessToken });
      return true;
    } catch {
      get().logout();
      return false;
    }
  },
});
