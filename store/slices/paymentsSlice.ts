import { StateCreator } from 'zustand';
import { StoreState } from '../index';
import { Payment, InitializePaymentPayload, InitializePaymentResponse, VerifyPaymentResponse } from '@/types';
import { api } from '@/lib/api';

export interface PaymentsSlice {
  paymentHistory: Payment[];
  currentReceipt: Payment | null;
  paymentsLoading: boolean;
  paymentsError: string | null;

  initializePayment: (payload: InitializePaymentPayload) => Promise<InitializePaymentResponse | undefined>;
  verifyPayment: (reference: string) => Promise<VerifyPaymentResponse | undefined>;
  fetchPaymentHistory: () => Promise<void>;
  fetchPaymentReceipt: (id: string) => Promise<Payment | undefined>;
}

export const createPaymentsSlice: StateCreator<
  StoreState,
  [['zustand/persist', unknown]],
  [],
  PaymentsSlice
> = (set, get) => ({
  paymentHistory: [],
  currentReceipt: null,
  paymentsLoading: false,
  paymentsError: null,

  initializePayment: async (payload) => {
    set({ paymentsLoading: true, paymentsError: null });
    try {
      const data = await api.post<InitializePaymentResponse>('/payments/initialize', payload, get().token || undefined);
      set({ paymentsLoading: false });
      return data;
    } catch (e: any) {
      set({ paymentsError: e.message || 'Payment initialization failed', paymentsLoading: false });
    }
  },

  verifyPayment: async (reference) => {
    set({ paymentsLoading: true, paymentsError: null });
    try {
      const data = await api.get<VerifyPaymentResponse>(`/payments/verify/${reference}`, get().token || undefined);
      set({ paymentsLoading: false });
      return data;
    } catch (e: any) {
      set({ paymentsError: e.message || 'Payment verification failed', paymentsLoading: false });
    }
  },

  fetchPaymentHistory: async () => {
    set({ paymentsLoading: true, paymentsError: null });
    try {
      const data = await api.get<Payment[]>('/payments/history', get().token || undefined);
      set({ paymentHistory: data, paymentsLoading: false });
    } catch (e: any) {
      set({ paymentsError: e.message || 'Failed to fetch payment history', paymentsLoading: false });
    }
  },

  fetchPaymentReceipt: async (id) => {
    set({ paymentsLoading: true, paymentsError: null });
    try {
      const data = await api.get<Payment>(`/payments/receipt/${id}`, get().token || undefined);
      set({ currentReceipt: data, paymentsLoading: false });
      return data;
    } catch (e: any) {
      set({ paymentsError: e.message || 'Failed to fetch receipt', paymentsLoading: false });
    }
  },
});
