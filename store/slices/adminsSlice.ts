import { StateCreator } from 'zustand';
import { StoreState, useStore } from '../index';
import { CreateAdminPayload, CreateAdminResponse, OwnerAdminData } from '@/types';
import { api } from '@/lib/api';

export interface AdminsSlice {
  ownerAdmins: OwnerAdminData[];
  adminsLoading: boolean;
  adminsError: string | null;
  createAdmin: (payload: CreateAdminPayload) => Promise<CreateAdminResponse | undefined>;
  fetchOwnerAdmins: () => Promise<void>;
  deleteOwnerAdmin: (id: string) => Promise<boolean>;
}

export const createAdminsSlice: StateCreator<
  StoreState,
  [['zustand/persist', unknown]],
  [],
  AdminsSlice
> = (set) => ({
  ownerAdmins: [],
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

  fetchOwnerAdmins: async () => {
    set({ adminsLoading: true, adminsError: null });
    try {
      const response = await api.get<{ admins: OwnerAdminData[] }>('/owner/get-admins', useStore.getState().token || undefined);
      set({
        ownerAdmins: response.admins || [],
        adminsLoading: false,
      });
    } catch (error: any) {
      set({
        adminsLoading: false,
        adminsError: error.response?.data?.message || 'Failed to fetch admins',
      });
    }
  },

  deleteOwnerAdmin: async (id: string) => {
    set({ adminsLoading: true, adminsError: null });
    try {
      await api.delete<{ message: string }>(`/owner/delete-admin/${id}`, useStore.getState().token || undefined);
      set((state) => ({
        ownerAdmins: state.ownerAdmins.filter(admin => admin.id !== id),
        adminsLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        adminsLoading: false,
        adminsError: error.response?.data?.message || 'Failed to delete admin',
      });
      return false;
    }
  },
});
