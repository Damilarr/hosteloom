import type { StateCreator } from 'zustand';
import type { AcademicSession, CreateSessionPayload, ApiError } from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface SessionsSlice {
  sessions: AcademicSession[];
  sessionsLoading: boolean;
  sessionsError: string | null;

  fetchSessions: () => Promise<void>;
  createSession: (payload: CreateSessionPayload) => Promise<boolean>;
  activateSession: (sessionId: string) => Promise<boolean>;
}

export const createSessionsSlice: StateCreator<SessionsSlice & WithToken, [], [], SessionsSlice> = (set, get) => ({
  sessions: [],
  sessionsLoading: false,
  sessionsError: null,

  fetchSessions: async () => {
    set({ sessionsLoading: true, sessionsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<AcademicSession[]>('/admin/get-sessions', token);
      set({ sessions: Array.isArray(data) ? data : [], sessionsLoading: false });
    } catch (err) {
      set({ sessionsLoading: false, sessionsError: (err as ApiError).message });
    }
  },

  createSession: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const session = await api.post<AcademicSession>('/admin/create-session', payload, token);
      set((state) => ({
        sessions: [session, ...state.sessions],
      }));
      return true;
    } catch {
      return false;
    }
  },

  activateSession: async (sessionId) => {
    try {
      const token = get().token ?? undefined;
      await api.patch<{ message: string }>(`/admin/sessions/${sessionId}/activate`, {}, token);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? { ...s, isActive: true } : { ...s, isActive: false },
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },
});
