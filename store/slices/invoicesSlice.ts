import { StateCreator } from 'zustand';
import { StoreState } from '../index';
import { InvoiceWithDetails } from '@/types';
import { api } from '@/lib/api';

export interface InvoicesSlice {
  invoices: InvoiceWithDetails[];
  myInvoices: InvoiceWithDetails[];
  currentInvoice: InvoiceWithDetails | null;
  invoicesLoading: boolean;
  invoicesError: string | null;

  fetchAllInvoices: () => Promise<void>;
  fetchMyInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<InvoiceWithDetails | undefined>;
}

export const createInvoicesSlice: StateCreator<
  StoreState,
  [['zustand/persist', unknown]],
  [],
  InvoicesSlice
> = (set, get) => ({
  invoices: [],
  myInvoices: [],
  currentInvoice: null,
  invoicesLoading: false,
  invoicesError: null,

  fetchAllInvoices: async () => {
    set({ invoicesLoading: true, invoicesError: null });
    try {
      const data = await api.get<InvoiceWithDetails[]>('/invoices/get-all-invoices', get().token || undefined);
      set({ invoices: data, invoicesLoading: false });
    } catch (e: any) {
      set({ invoicesError: e.message || 'Failed to fecth all invoices', invoicesLoading: false });
    }
  },

  fetchMyInvoices: async () => {
    set({ invoicesLoading: true, invoicesError: null });
    try {
      const data = await api.get<InvoiceWithDetails[]>('/invoices/my-invoices', get().token || undefined);
      set({ myInvoices: data, invoicesLoading: false });
    } catch (e: any) {
      set({ invoicesError: e.message || 'Failed to fetch my invoices', invoicesLoading: false });
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ invoicesLoading: true, invoicesError: null });
    try {
      const data = await api.get<InvoiceWithDetails>(`/invoices/${id}`, get().token || undefined);
      set({ currentInvoice: data, invoicesLoading: false });
      return data;
    } catch (e: any) {
      set({ invoicesError: e.message || 'Failed to fetch invoice', invoicesLoading: false });
    }
  },
});
