import type { StateCreator } from 'zustand';
import type {
  RoomWithDetails, AvailableRoom, Room,
  CreateRoomPayload, BulkCreateRoomsPayload, BulkCreateRoomsResponse,
  UpdateRoomPayload,
  AllocateRoomPayload, AllocateRoomResponse,
  CheckoutResponse,
  ReassignRoomPayload, ReassignRoomResponse,
  OccupantAllocation, AllocationHistoryEntry,
  ApiError,
  PaginatedMeta, PaginatedResponse,
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface RoomsSlice {
  rooms: RoomWithDetails[];
  roomsMeta: PaginatedMeta | null;
  roomsLoading: boolean;
  roomsError: string | null;

  availableRooms: AvailableRoom[];
  availableRoomsLoading: boolean;

  occupants: OccupantAllocation[];
  occupantsLoading: boolean;

  studentHistory: AllocationHistoryEntry[];
  studentHistoryLoading: boolean;

  fetchRooms: (page?: number, limit?: number) => Promise<void>;
  fetchAvailableRooms: () => Promise<void>;
  createRoom: (payload: CreateRoomPayload) => Promise<boolean>;
  bulkCreateRooms: (payload: BulkCreateRoomsPayload) => Promise<number | false>;
  updateRoom: (roomId: string, payload: UpdateRoomPayload) => Promise<boolean>;
  allocateRoom: (payload: AllocateRoomPayload) => Promise<AllocateRoomResponse | false>;
  checkoutRoom: (allocationId: string) => Promise<boolean>;
  reassignRoom: (payload: ReassignRoomPayload) => Promise<boolean>;
  fetchOccupants: (roomId: string) => Promise<void>;
  fetchStudentHistory: (studentId: string) => Promise<void>;
  fetchRoomById: (id: string) => Promise<RoomWithDetails | null>;
}

export const createRoomsSlice: StateCreator<RoomsSlice & WithToken, [], [], RoomsSlice> = (set, get) => ({
  rooms: [],
  roomsMeta: null,
  roomsLoading: false,
  roomsError: null,

  availableRooms: [],
  availableRoomsLoading: false,

  occupants: [],
  occupantsLoading: false,

  studentHistory: [],
  studentHistoryLoading: false,

  fetchRooms: async (page = 1, limit = 10) => {
    set({ roomsLoading: true, roomsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<PaginatedResponse<RoomWithDetails>>(`/rooms/get-all-rooms?page=${page}&limit=${limit}`, token);
      set({ 
        rooms: Array.isArray(response.data) ? response.data : [], 
        roomsMeta: response.meta,
        roomsLoading: false 
      });
    } catch (err) {
      set({ roomsLoading: false, roomsError: (err as ApiError).message });
    }
  },

  fetchAvailableRooms: async () => {
    set({ availableRoomsLoading: true });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<AvailableRoom[]>('/allocations/available-rooms', token);
      set({ availableRooms: Array.isArray(data) ? data : [], availableRoomsLoading: false });
    } catch {
      set({ availableRoomsLoading: false });
    }
  },

  createRoom: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const room = await api.post<Room>('/rooms/create-room', payload, token);
      set((state) => ({
        rooms: [...state.rooms, { ...room, allocations: [], occupancyCount: 0, status: 'VACANT' as const }],
      }));
      return true;
    } catch {
      return false;
    }
  },

  bulkCreateRooms: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.post<BulkCreateRoomsResponse>('/rooms/bulk-create-rooms', payload, token);
      const meta = get().roomsMeta;
      get().fetchRooms(meta?.page ?? 1, meta?.limit ?? 10);
      return data.count;
    } catch {
      return false;
    }
  },

  updateRoom: async (roomId, payload) => {
    try {
      const token = get().token ?? undefined;
      const updated = await api.patch<Room>(`/rooms/update-room/${roomId}`, payload, token);
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === roomId ? { ...room, ...updated } : room,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  allocateRoom: async (payload) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.post<AllocateRoomResponse>('/allocations/allocate-room', payload, token);
      const meta = get().roomsMeta;
      get().fetchRooms(meta?.page ?? 1, meta?.limit ?? 10);
      get().fetchAvailableRooms();
      return data;
    } catch {
      return false;
    }
  },

  checkoutRoom: async (allocationId) => {
    try {
      const token = get().token ?? undefined;
      await api.patch<CheckoutResponse>(`/allocations/${allocationId}/checkout`, {}, token);
      const meta = get().roomsMeta;
      get().fetchRooms(meta?.page ?? 1, meta?.limit ?? 10);
      get().fetchAvailableRooms();
      return true;
    } catch {
      return false;
    }
  },

  reassignRoom: async (payload) => {
    try {
      const token = get().token ?? undefined;
      await api.post<ReassignRoomResponse>('/allocations/reassign-room', payload, token);
      const meta = get().roomsMeta;
      get().fetchRooms(meta?.page ?? 1, meta?.limit ?? 10);
      get().fetchAvailableRooms();
      return true;
    } catch {
      return false;
    }
  },

  fetchOccupants: async (roomId) => {
    set({ occupantsLoading: true });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<OccupantAllocation[]>(`/allocations/room/${roomId}/occupants`, token);
      set({ occupants: Array.isArray(data) ? data : [], occupantsLoading: false });
    } catch {
      set({ occupants: [], occupantsLoading: false });
    }
  },

  fetchStudentHistory: async (studentId) => {
    set({ studentHistoryLoading: true });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<AllocationHistoryEntry[]>(`/allocations/student/${studentId}/history`, token);
      set({ studentHistory: Array.isArray(data) ? data : [], studentHistoryLoading: false });
    } catch {
      set({ studentHistory: [], studentHistoryLoading: false });
    }
  },

  fetchRoomById: async (id) => {
    set({ roomsLoading: true, roomsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<RoomWithDetails>(`/rooms/get-room-by-id/${id}`, token);
      // Optional: add to state if necessary, but returning it is useful
      set({ roomsLoading: false });
      return data;
    } catch (err) {
      set({ roomsLoading: false, roomsError: (err as ApiError).message });
      return null;
    }
  },
});
