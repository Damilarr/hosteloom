import type { StateCreator } from 'zustand';
import type { 
  DashboardSummary, 
  DashboardSummaryResponse, 
  DashboardReportResponse, 
  ReportRoomData, 
  ReportAllocationData,
  ReportPaymentData,
  ReportMaintenanceData,
  ReportType, 
  ApiError 
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface DashboardSlice {
  summaryData: DashboardSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;

  reportData: (ReportRoomData | ReportAllocationData | ReportPaymentData | ReportMaintenanceData)[];
  reportLoading: boolean;
  reportError: string | null;

  fetchSummaryData: () => Promise<void>;
  fetchReport: (type: ReportType) => Promise<void>;
}

export const createDashboardSlice: StateCreator<DashboardSlice & WithToken, [], [], DashboardSlice> = (set, get) => ({
  summaryData: null,
  summaryLoading: false,
  summaryError: null,

  reportData: [],
  reportLoading: false,
  reportError: null,

  fetchSummaryData: async () => {
    set({ summaryLoading: true, summaryError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<DashboardSummaryResponse>('/dashboard/summary-data', token);
      set({ summaryData: response.data, summaryLoading: false });
    } catch (err) {
      set({ summaryLoading: false, summaryError: (err as ApiError).message });
    }
  },

  fetchReport: async (type: ReportType) => {
    set({ reportLoading: true, reportError: null, reportData: [] });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<DashboardReportResponse>(`/dashboard/reports/${type}`, token);
      set({ reportData: Array.isArray(response.data) ? response.data : [], reportLoading: false });
    } catch (err) {
      set({ reportLoading: false, reportError: (err as ApiError).message });
    }
  },
});
