import type { StateCreator } from 'zustand';
import type { HostelApplication, ApplyToHostelPayload, ApiError } from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface ApplicationsSlice {
  myApplications: HostelApplication[];
  appsLoading: boolean;
  appsError: string | null;

  fetchMyApplications: () => Promise<void>;
  fetchAllApplications: (hostelId: string) => Promise<void>;
  applyToHostel: (payload: ApplyToHostelPayload) => Promise<boolean>;
  approveApplication: (id: string) => Promise<boolean>;
  rejectApplication: (id: string, reason: string) => Promise<boolean>;
}

export const createApplicationsSlice: StateCreator<ApplicationsSlice & WithToken, [], [], ApplicationsSlice> = (set, get) => ({
  myApplications: [],
  appsLoading: false,
  appsError: null,

  fetchMyApplications: async () => {
    set({ appsLoading: true, appsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<{ applications: HostelApplication[] }>('/hostel-applications/my-applications', token);
      set({ myApplications: Array.isArray(response.applications) ? response.applications : [], appsLoading: false });
    } catch (err) {
      set({ appsLoading: false, appsError: (err as ApiError).message });
    }
  },

  fetchAllApplications: async (hostelId) => {
    set({ appsLoading: true, appsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<{ applications: HostelApplication[] }>(`/hostel-applications/hostel/${hostelId}`, token);
      set({ myApplications: Array.isArray(response.applications) ? response.applications : [], appsLoading: false });
    } catch (err) {
      set({ appsLoading: false, appsError: (err as ApiError).message });
    }
  },

  applyToHostel: async (payload) => {
    set({ appsLoading: true, appsError: null });
    try {
      const token = get().token ?? undefined;
      await api.post('/hostel-applications/apply', payload, token);
      get().fetchMyApplications();
      set({ appsLoading: false });
      return true;
    } catch (err) {
      set({ appsLoading: false, appsError: (err as ApiError).message });
      return false;
    }
  },

  approveApplication: async (id) => {
    try {
      const token = get().token ?? undefined;
      await api.patch(`/hostel-applications/${id}/approve`, {}, token);
      const applications = get().myApplications;
      const app = applications.find(a => a.id === id);
      if (app) get().fetchAllApplications(app.hostelId);
      return true;
    } catch {
      return false;
    }
  },

  rejectApplication: async (id, reason) => {
    try {
      const token = get().token ?? undefined;
      await api.patch(`/hostel-applications/${id}/reject`, { reason }, token);
      const applications = get().myApplications;
      const app = applications.find(a => a.id === id);
      if (app) get().fetchAllApplications(app.hostelId);
      return true;
    } catch {
      return false;
    }
  },
});
