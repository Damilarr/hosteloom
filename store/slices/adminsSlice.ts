import { StateCreator } from 'zustand';
import { StoreState, useStore } from '../index';
import { CreateAdminPayload, CreateAdminResponse } from '@/types';
import { api } from '@/lib/api';

export interface AdminsSlice {
  adminsLoading: boolean;
  adminsError: string | null;
  createAdmin: (payload: CreateAdminPayload) => Promise<CreateAdminResponse | undefined>;
}

export const createAdminsSlice: StateCreator<
  StoreState,
  [['zustand/persist', unknown]],
  [],
  AdminsSlice
> = (set) => ({
  adminsLoading: false,
  adminsError: null,

  createAdmin: async (payload) => {
    set({ adminsLoading: true, adminsError: null });
    try {
      const response = await api.post<CreateAdminResponse>('/super-admin/create-admin', payload, useStore.getState().token || undefined);
      set({ adminsLoading: false });
      return response;
    } catch (error: any) {
      set({
        adminsLoading: false,
        adminsError: error.response?.data?.message || 'Failed to create admin',
      });
    }
  },
});
