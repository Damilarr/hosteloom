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
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface RoomsSlice {
  rooms: RoomWithDetails[];
  roomsLoading: boolean;
  roomsError: string | null;

  availableRooms: AvailableRoom[];
  availableRoomsLoading: boolean;

  occupants: OccupantAllocation[];
  occupantsLoading: boolean;

  studentHistory: AllocationHistoryEntry[];
  studentHistoryLoading: boolean;

  fetchRooms: () => Promise<void>;
  fetchAvailableRooms: () => Promise<void>;
  createRoom: (payload: CreateRoomPayload) => Promise<boolean>;
  bulkCreateRooms: (payload: BulkCreateRoomsPayload) => Promise<number | false>;
  updateRoom: (roomId: string, payload: UpdateRoomPayload) => Promise<boolean>;
  allocateRoom: (payload: AllocateRoomPayload) => Promise<AllocateRoomResponse | false>;
  checkoutRoom: (allocationId: string) => Promise<boolean>;
  reassignRoom: (payload: ReassignRoomPayload) => Promise<boolean>;
  fetchOccupants: (roomId: string) => Promise<void>;
  fetchStudentHistory: (studentId: string) => Promise<void>;
}

export const createRoomsSlice: StateCreator<RoomsSlice & WithToken, [], [], RoomsSlice> = (set, get) => ({
  rooms: [],
  roomsLoading: false,
  roomsError: null,

  availableRooms: [],
  availableRoomsLoading: false,

  occupants: [],
  occupantsLoading: false,

  studentHistory: [],
  studentHistoryLoading: false,

  fetchRooms: async () => {
    set({ roomsLoading: true, roomsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<RoomWithDetails[]>('/rooms/get-all-rooms', token);
      set({ rooms: Array.isArray(data) ? data : [], roomsLoading: false });
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
      get().fetchRooms();
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
      get().fetchRooms();
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
      get().fetchRooms();
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
      get().fetchRooms();
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
});
