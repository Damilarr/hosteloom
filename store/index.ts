import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createProfileSlice, type ProfileSlice } from './slices/profileSlice';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';
import { createComplaintsSlice, type ComplaintsSlice } from './slices/complaintsSlice';
import { createRoomsSlice, type RoomsSlice } from './slices/roomsSlice';
import { createSessionsSlice, type SessionsSlice } from './slices/sessionsSlice';
import { createAdminsSlice, type AdminsSlice } from './slices/adminsSlice';
import { createInvoicesSlice, type InvoicesSlice } from './slices/invoicesSlice';
import { createPaymentsSlice, type PaymentsSlice } from './slices/paymentsSlice';
import { createHostelsSlice, type HostelsSlice } from './slices/hostelsSlice';
import { createBlocksSlice, type BlocksSlice } from './slices/blocksSlice';
import { createFloorsSlice, type FloorsSlice } from './slices/floorsSlice';

export type StoreState = AuthSlice & ProfileSlice & StudentsSlice & ComplaintsSlice & RoomsSlice & SessionsSlice & AdminsSlice & InvoicesSlice & PaymentsSlice & HostelsSlice & BlocksSlice & FloorsSlice & { _hasHydrated: boolean };

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createProfileSlice(...args),
      ...createStudentsSlice(...args),
      ...createComplaintsSlice(...args),
      ...createRoomsSlice(...args),
      ...createSessionsSlice(...args),
      ...createAdminsSlice(...args),
      ...createInvoicesSlice(...args),
      ...createPaymentsSlice(...args),
      ...createHostelsSlice(...args),
      ...createBlocksSlice(...args),
      ...createFloorsSlice(...args),
      _hasHydrated: false,
    }),
    {
      name: 'hl_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        profile: state.profile,
        adminProfile: state.adminProfile,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          state.isAuthenticated = true;
        }
        if (state) state._hasHydrated = true;
      },
    }
  )
);

// ─── Typed selector hooks ─────────────────────────────────────────────────────

export const useAuthStore = () => useStore(useShallow((s) => ({
  user: s.user,
  token: s.token,
  refreshToken: s.refreshToken,
  isAuthenticated: s.isAuthenticated,
  isLoading: s.isLoading,
  error: s.error,
  login: s.login,
  register: s.register,
  logout: s.logout,
  clearError: s.clearError,
  refreshSession: s.refreshSession,
})));

export const useProfileStore = () => useStore(useShallow((s) => ({
  profile: s.profile,
  profileLoading: s.profileLoading,
  profileError: s.profileError,
  fetchProfile: s.fetchProfile,
  saveProfile: s.saveProfile,
  adminProfile: s.adminProfile,
  adminProfileLoading: s.adminProfileLoading,
  adminProfileError: s.adminProfileError,
  fetchAdminProfile: s.fetchAdminProfile,
  saveAdminProfile: s.saveAdminProfile,
  ownerProfile: s.ownerProfile,
  ownerProfileLoading: s.ownerProfileLoading,
  ownerProfileError: s.ownerProfileError,
  fetchOwnerProfile: s.fetchOwnerProfile,
  saveOwnerProfile: s.saveOwnerProfile,
  clearProfileError: s.clearProfileError,
})));
export const useStudentsStore = () => useStore(useShallow((s) => ({
  students: s.students,
  studentsLoading: s.studentsLoading,
  studentsError: s.studentsError,
  fetchStudents: s.fetchStudents,
  approveStudent: s.approveStudent,
  rejectStudent: s.rejectStudent,
  deleteStudent: s.deleteStudent,
})));

export const useComplaintsStore = () => useStore(useShallow((s) => ({
  myComplaints: s.myComplaints,
  myComplaintsLoading: s.myComplaintsLoading,
  myComplaintsError: s.myComplaintsError,
  fetchMyComplaints: s.fetchMyComplaints,
  createComplaint: s.createComplaint,
  allComplaints: s.allComplaints,
  allComplaintsLoading: s.allComplaintsLoading,
  allComplaintsError: s.allComplaintsError,
  fetchAllComplaints: s.fetchAllComplaints,
  updateComplaintStatus: s.updateComplaintStatus,
})));

export const useRoomsStore = () => useStore(useShallow((s) => ({
  rooms: s.rooms,
  roomsMeta: s.roomsMeta,
  roomsLoading: s.roomsLoading,
  roomsError: s.roomsError,
  availableRooms: s.availableRooms,
  availableRoomsLoading: s.availableRoomsLoading,
  occupants: s.occupants,
  occupantsLoading: s.occupantsLoading,
  studentHistory: s.studentHistory,
  studentHistoryLoading: s.studentHistoryLoading,
  fetchRooms: s.fetchRooms,
  fetchAvailableRooms: s.fetchAvailableRooms,
  createRoom: s.createRoom,
  bulkCreateRooms: s.bulkCreateRooms,
  updateRoom: s.updateRoom,
  allocateRoom: s.allocateRoom,
  checkoutRoom: s.checkoutRoom,
  reassignRoom: s.reassignRoom,
  fetchOccupants: s.fetchOccupants,
  fetchStudentHistory: s.fetchStudentHistory,
})));

export const useSessionsStore = () => useStore(useShallow((s) => ({
  sessions: s.sessions,
  sessionsLoading: s.sessionsLoading,
  sessionsError: s.sessionsError,
  fetchSessions: s.fetchSessions,
  createSession: s.createSession,
  activateSession: s.activateSession,
})));

export const useAdminsStore = () => useStore(useShallow((s) => ({
  adminsLoading: s.adminsLoading,
  adminsError: s.adminsError,
  createAdmin: s.createAdmin,
})));

export const useInvoicesStore = () => useStore(useShallow((s) => ({
  invoices: s.invoices,
  myInvoices: s.myInvoices,
  currentInvoice: s.currentInvoice,
  invoicesLoading: s.invoicesLoading,
  invoicesError: s.invoicesError,
  fetchAllInvoices: s.fetchAllInvoices,
  fetchMyInvoices: s.fetchMyInvoices,
  fetchInvoiceById: s.fetchInvoiceById,
})));

export const usePaymentsStore = () => useStore(useShallow((s) => ({
  paymentHistory: s.paymentHistory,
  currentReceipt: s.currentReceipt,
  paymentsLoading: s.paymentsLoading,
  paymentsError: s.paymentsError,
  initializePayment: s.initializePayment,
  verifyPayment: s.verifyPayment,
  fetchPaymentHistory: s.fetchPaymentHistory,
  fetchPaymentReceipt: s.fetchPaymentReceipt,
})));

export const useHostelsStore = () => useStore(useShallow((s) => ({
  hostels: s.hostels,
  currentHostel: s.currentHostel,
  hostelsLoading: s.hostelsLoading,
  hostelsError: s.hostelsError,
  fetchAllHostels: s.fetchAllHostels,
  fetchHostelById: s.fetchHostelById,
  createHostel: s.createHostel,
  updateHostel: s.updateHostel,
  deleteHostel: s.deleteHostel,
})));

export const useBlocksStore = () => useStore(useShallow((s) => ({
  blocks: s.blocks,
  currentBlock: s.currentBlock,
  blocksLoading: s.blocksLoading,
  blocksError: s.blocksError,
  fetchBlocksByHostel: s.fetchBlocksByHostel,
  fetchBlockById: s.fetchBlockById,
  createBlock: s.createBlock,
  updateBlock: s.updateBlock,
  deleteBlock: s.deleteBlock,
})));

export const useFloorsStore = () => useStore(useShallow((s) => ({
  floors: s.floors,
  currentFloor: s.currentFloor,
  floorsLoading: s.floorsLoading,
  floorsError: s.floorsError,
  fetchFloorsByBlock: s.fetchFloorsByBlock,
  fetchFloorById: s.fetchFloorById,
  createFloor: s.createFloor,
  updateFloor: s.updateFloor,
  deleteFloor: s.deleteFloor,
})));
