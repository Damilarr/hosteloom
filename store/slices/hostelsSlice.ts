import type { StateCreator } from 'zustand';
import type {
  Hostel, CreateHostelPayload, UpdateHostelPayload, ApiError
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface HostelsSlice {
  hostels: Hostel[];
  currentHostel: Hostel | null;
  hostelsLoading: boolean;
  hostelsError: string | null;
  searchResults: Hostel[];
  searchLoading: boolean;

  fetchAllHostels: () => Promise<void>;
  fetchHostelById: (id: string) => Promise<Hostel | null>;
  createHostel: (payload: CreateHostelPayload) => Promise<Hostel | false>;
  updateHostel: (id: string, payload: UpdateHostelPayload) => Promise<Hostel | false>;
  deleteHostel: (id: string) => Promise<boolean>;
  searchHostels: (query: string) => Promise<void>;
}

export const createHostelsSlice: StateCreator<HostelsSlice & WithToken, [], [], HostelsSlice> = (set, get) => ({
  hostels: [],
  currentHostel: null,
  hostelsLoading: false,
  hostelsError: null,
  searchResults: [],
  searchLoading: false,

  fetchAllHostels: async () => {
    set({ hostelsLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Hostel[]>('/hostels/get-all-hostels', token);
      set({ hostels: Array.isArray(data) ? data : [], hostelsLoading: false });
    } catch (err) {
      set({ hostelsLoading: false, hostelsError: (err as ApiError).message });
    }
  },

  fetchHostelById: async (id) => {
    set({ hostelsLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Hostel>(`/hostels/get-hostel/${id}`, token);
      set({ currentHostel: data, hostelsLoading: false });
      return data;
    } catch (err) {
      set({ hostelsLoading: false, hostelsError: (err as ApiError).message });
      return null;
    }
  },

  createHostel: async (payload) => {
    set({ hostelsLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.post<{ message: string, hostel: Hostel }>('/hostels/create-hostel', payload, token);
      set((state) => ({
        hostels: [...state.hostels, response.hostel],
        hostelsLoading: false
      }));
      return response.hostel;
    } catch (err) {
      set({ hostelsLoading: false, hostelsError: (err as ApiError).message });
      return false;
    }
  },

  updateHostel: async (id, payload) => {
    set({ hostelsLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.patch<{ message: string, hostel: Hostel }>(`/hostels/update-hostel/${id}`, payload, token);
      // If we use PATCH according to the block "Update Hostel - Method: PATCH" in some endpoints, or PUT
      set((state) => ({
        hostels: state.hostels.map(h => h.id === id ? response.hostel : h),
        currentHostel: state.currentHostel?.id === id ? response.hostel : state.currentHostel,
        hostelsLoading: false
      }));
      return response.hostel;
    } catch (err) {
      set({ hostelsLoading: false, hostelsError: (err as ApiError).message });
      return false;
    }
  },

  deleteHostel: async (id) => {
    set({ hostelsLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      await api.delete<{ message: string }>(`/hostels/delete-hostel/${id}`, token);
      set((state) => ({
        hostels: state.hostels.filter(h => h.id !== id),
        currentHostel: state.currentHostel?.id === id ? null : state.currentHostel,
        hostelsLoading: false
      }));
      return true;
    } catch (err) {
      set({ hostelsLoading: false, hostelsError: (err as ApiError).message });
      return false;
    }
  },

  searchHostels: async (query) => {
    if (!query) {
      set({ searchResults: [] });
      return;
    }
    set({ searchLoading: true, hostelsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<{ message: string, data: Hostel[] }>(`/hostels/search-hostels?q=${encodeURIComponent(query)}`, token);
      set({ searchResults: Array.isArray(response.data) ? response.data : [], searchLoading: false });
    } catch (err) {
      set({ searchLoading: false, hostelsError: (err as ApiError).message });
    }
  },
});
