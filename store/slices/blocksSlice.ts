import type { StateCreator } from 'zustand';
import type {
  Block, CreateBlockPayload, UpdateBlockPayload, ApiError
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface BlocksSlice {
  blocks: Block[];
  currentBlock: Block | null;
  blocksLoading: boolean;
  blocksError: string | null;

  fetchBlocksByHostel: (hostelId: string) => Promise<void>;
  fetchBlockById: (id: string) => Promise<Block | null>;
  createBlock: (payload: CreateBlockPayload) => Promise<Block | false>;
  updateBlock: (id: string, payload: UpdateBlockPayload) => Promise<Block | false>;
  deleteBlock: (id: string) => Promise<boolean>;
}

export const createBlocksSlice: StateCreator<BlocksSlice & WithToken, [], [], BlocksSlice> = (set, get) => ({
  blocks: [],
  currentBlock: null,
  blocksLoading: false,
  blocksError: null,

  fetchBlocksByHostel: async (hostelId) => {
    set({ blocksLoading: true, blocksError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Block[]>(`/blocks/get-blocks-by-hostel?hostelId=${hostelId}`, token);
      set({ blocks: Array.isArray(data) ? data : [], blocksLoading: false });
    } catch (err) {
      set({ blocksLoading: false, blocksError: (err as ApiError).message });
    }
  },

  fetchBlockById: async (id) => {
    set({ blocksLoading: true, blocksError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<Block>(`/blocks/get-block/${id}`, token);
      set({ currentBlock: data, blocksLoading: false });
      return data;
    } catch (err) {
      set({ blocksLoading: false, blocksError: (err as ApiError).message });
      return null;
    }
  },

  createBlock: async (payload) => {
    set({ blocksLoading: true, blocksError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.post<{ message: string, block: Block }>('/blocks/create-block', payload, token);
      set((state) => ({
        blocks: [...state.blocks, response.block],
        blocksLoading: false
      }));
      return response.block;
    } catch (err) {
      set({ blocksLoading: false, blocksError: (err as ApiError).message });
      return false;
    }
  },

  updateBlock: async (id, payload) => {
    set({ blocksLoading: true, blocksError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.put<{ message: string, block: Block }>(`/blocks/update-block/${id}`, payload, token);
      set((state) => ({
        blocks: state.blocks.map(b => b.id === id ? response.block : b),
        currentBlock: state.currentBlock?.id === id ? response.block : state.currentBlock,
        blocksLoading: false
      }));
      return response.block;
    } catch (err) {
      set({ blocksLoading: false, blocksError: (err as ApiError).message });
      return false;
    }
  },

  deleteBlock: async (id) => {
    set({ blocksLoading: true, blocksError: null });
    try {
      const token = get().token ?? undefined;
      await api.delete<{ message: string }>(`/blocks/delete-block/${id}`, token);
      set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id),
        currentBlock: state.currentBlock?.id === id ? null : state.currentBlock,
        blocksLoading: false
      }));
      return true;
    } catch (err) {
      set({ blocksLoading: false, blocksError: (err as ApiError).message });
      return false;
    }
  }
});
