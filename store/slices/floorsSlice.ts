import type { StateCreator } from 'zustand';
import type {
  Floor, CreateFloorPayload, UpdateFloorPayload, ApiError
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface FloorsSlice {
  floors: Floor[];
  currentFloor: Floor | null;
  floorsLoading: boolean;
  floorsError: string | null;

  fetchFloorsByBlock: (blockId: string) => Promise<void>;
  fetchFloorById: (id: string) => Promise<Floor | null>;
  createFloor: (payload: CreateFloorPayload) => Promise<Floor | false>;
  updateFloor: (id: string, payload: UpdateFloorPayload) => Promise<Floor | false>;
  deleteFloor: (id: string) => Promise<boolean>;
}

export const createFloorsSlice: StateCreator<FloorsSlice & WithToken, [], [], FloorsSlice> = (set, get) => ({
  floors: [],
  currentFloor: null,
  floorsLoading: false,
  floorsError: null,

  fetchFloorsByBlock: async (blockId) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Floor[]>(`/floors/get-floors-by-block?blockId=${blockId}`, token);
      set({ floors: Array.isArray(data) ? data : [], floorsLoading: false });
    } catch (err) {
      set({ floorsLoading: false, floorsError: (err as ApiError).message });
    }
  },

  fetchFloorById: async (id) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Floor>(`/floors/get-floor/${id}`, token);
      set({ currentFloor: data, floorsLoading: false });
      return data;
    } catch (err) {
      set({ floorsLoading: false, floorsError: (err as ApiError).message });
      return null;
    }
  },

  createFloor: async (payload) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.post<{ message: string, floor: Floor }>('/floors/create-floor', payload, token);
      set((state) => ({
        floors: [...state.floors, response.floor],
        floorsLoading: false
      }));
      return response.floor;
    } catch (err) {
      set({ floorsLoading: false, floorsError: (err as ApiError).message });
      return false;
    }
  },

  updateFloor: async (id, payload) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.put<{ message: string, block: Floor }>(`/floors/update-floor/${id}`, payload, token);
      // Endpoint docs return 'block' for update floor response, but realistically it's floor
      const updatedFloor = response.block || (response as any).floor;
      set((state) => ({
        floors: state.floors.map(f => f.id === id ? updatedFloor : f),
        currentFloor: state.currentFloor?.id === id ? updatedFloor : state.currentFloor,
        floorsLoading: false
      }));
      return updatedFloor;
    } catch (err) {
      set({ floorsLoading: false, floorsError: (err as ApiError).message });
      return false;
    }
  },

  deleteFloor: async (id) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const token = get().token ?? undefined;
      // Postman docs specify DELETE /blocks/floor-block/:floorId
      await api.delete<{ message: string }>(`/blocks/floor-block/${id}`, token);
      set((state) => ({
        floors: state.floors.filter(f => f.id !== id),
        currentFloor: state.currentFloor?.id === id ? null : state.currentFloor,
        floorsLoading: false
      }));
      return true;
    } catch (err) {
      set({ floorsLoading: false, floorsError: (err as ApiError).message });
      return false;
    }
  }
});
