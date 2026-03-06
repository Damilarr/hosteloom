import type { StateCreator } from 'zustand';
import type {
  UserProfile, ProfilePayload, ApiError,
  ProfileApiResponse, UnifiedProfileResponse,
  AdminProfile, AdminProfilePayload, AdminProfileApiResponse,
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface ProfileSlice {
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<boolean>;
  saveProfile: (payload: ProfilePayload) => Promise<boolean>;

  adminProfile: AdminProfile | null;
  adminProfileLoading: boolean;
  adminProfileError: string | null;
  fetchAdminProfile: () => Promise<boolean>;
  saveAdminProfile: (payload: AdminProfilePayload) => Promise<boolean>;

  clearProfileError: () => void;
}

export const createProfileSlice: StateCreator<ProfileSlice & WithToken, [], [], ProfileSlice> = (set, get) => ({
  // ─── Student ────────────────────────────────────────────────────────────────
  profile: null,
  profileLoading: false,
  profileError: null,

  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<UnifiedProfileResponse>('/auth/profile', token);
      set({ profile: data.profile, profileLoading: false });
      return true;
    } catch (err) {
      set({ profileLoading: false, profileError: (err as ApiError).message });
      return false;
    }
  },

  saveProfile: async (payload) => {
    set({ profileLoading: true, profileError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.post<ProfileApiResponse>('/users/profile', {
        ...payload,
        registrationStatus: 'PENDING',
      }, token);
      set({ profile: data.profile, profileLoading: false });
      return true;
    } catch (err) {
      set({ profileLoading: false, profileError: (err as ApiError).message });
      return false;
    }
  },

  // ─── Admin ──────────────────────────────────────────────────────────────────
  adminProfile: null,
  adminProfileLoading: false,
  adminProfileError: null,

  fetchAdminProfile: async () => {
    set({ adminProfileLoading: true, adminProfileError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<UnifiedProfileResponse>('/auth/profile', token);
      set({ adminProfile: data.adminProfile, adminProfileLoading: false });
      return true;
    } catch (err) {
      set({ adminProfileLoading: false, adminProfileError: (err as ApiError).message });
      return false;
    }
  },

  saveAdminProfile: async (payload) => {
    set({ adminProfileLoading: true, adminProfileError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.post<AdminProfileApiResponse>('/users/profile', payload, token);
      set({ adminProfile: data.profile, adminProfileLoading: false });
      return true;
    } catch (err) {
      set({ adminProfileLoading: false, adminProfileError: (err as ApiError).message });
      return false;
    }
  },

  clearProfileError: () => set({ profileError: null, adminProfileError: null }),
});
