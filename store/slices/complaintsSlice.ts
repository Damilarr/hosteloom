import type { StateCreator } from 'zustand';
import type {
  Complaint,
  AdminComplaint,
  CreateComplaintPayload,
  UpdateComplaintStatusPayload,
  ApiError,
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface ComplaintsSlice {
  myComplaints: Complaint[];
  myComplaintsLoading: boolean;
  myComplaintsError: string | null;
  fetchMyComplaints: () => Promise<void>;
  createComplaint: (payload: CreateComplaintPayload) => Promise<boolean>;

  allComplaints: AdminComplaint[];
  allComplaintsLoading: boolean;
  allComplaintsError: string | null;
  fetchAllComplaints: () => Promise<void>;
  updateComplaintStatus: (payload: UpdateComplaintStatusPayload) => Promise<boolean>;
}

export const createComplaintsSlice: StateCreator<ComplaintsSlice & WithToken, [], [], ComplaintsSlice> = (set, get) => ({
  // ─── Student ────────────────────────────────────────────────────────────────
  myComplaints: [],
  myComplaintsLoading: false,
  myComplaintsError: null,

  fetchMyComplaints: async () => {
    set({ myComplaintsLoading: true, myComplaintsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Complaint[]>('/complaints/get-complaints', token);
      set({ myComplaints: Array.isArray(data) ? data : [], myComplaintsLoading: false });
    } catch (err) {
      set({ myComplaintsLoading: false, myComplaintsError: (err as ApiError).message });
    }
  },

  createComplaint: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.post<Complaint>('/complaints/create-complaint', payload, token);
      set((state) => ({ myComplaints: [data, ...state.myComplaints] }));
      return true;
    } catch {
      return false;
    }
  },

  // ─── Admin ──────────────────────────────────────────────────────────────────
  allComplaints: [],
  allComplaintsLoading: false,
  allComplaintsError: null,

  fetchAllComplaints: async () => {
    set({ allComplaintsLoading: true, allComplaintsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<AdminComplaint[]>('/complaints/get-all-complaints', token);
      set({ allComplaints: Array.isArray(data) ? data : [], allComplaintsLoading: false });
    } catch (err) {
      set({ allComplaintsLoading: false, allComplaintsError: (err as ApiError).message });
    }
  },

  updateComplaintStatus: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.patch<Complaint>(
        '/complaints/update-complaint-status',
        payload,
        token,
      );
      set((state) => ({
        allComplaints: state.allComplaints.map((c) =>
          c.id === payload.complaintId ? { ...c, status: data.status } : c,
        ),
        myComplaints: state.myComplaints.map((c) =>
          c.id === payload.complaintId ? { ...c, status: data.status } : c,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },
});
