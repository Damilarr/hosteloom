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
import { createDashboardSlice, type DashboardSlice } from './slices/dashboardSlice';
import { createApplicationsSlice, type ApplicationsSlice } from './slices/applicationsSlice';
import { createNotificationsSlice, type NotificationsSlice } from './slices/notificationsSlice';

export type StoreState = AuthSlice & ProfileSlice & StudentsSlice & ComplaintsSlice & RoomsSlice & SessionsSlice & AdminsSlice & InvoicesSlice & PaymentsSlice & HostelsSlice & BlocksSlice & FloorsSlice & DashboardSlice & ApplicationsSlice & NotificationsSlice & { _hasHydrated: boolean };

/** Initial (empty) state for every non-auth slice. Called on logout to wipe stale data. */
const initialNonAuthState: Partial<StoreState> = {
  profile: null, profileLoading: false, profileError: null,
  adminProfile: null, adminProfileLoading: false, adminProfileError: null,
  ownerProfile: null, ownerProfileLoading: false, ownerProfileError: null,
  students: [], studentsLoading: false, studentsError: null,

  myComplaints: [], myComplaintsLoading: false, myComplaintsError: null,
  allComplaints: [], allComplaintsLoading: false, allComplaintsError: null,
  // rooms
  rooms: [], roomsMeta: null, roomsLoading: false, roomsError: null,
  availableRooms: [], availableRoomsLoading: false,
  availableRoomsForStudent: [], availableRoomsForStudentLoading: false,
  occupants: [], occupantsLoading: false,
  studentHistory: [], studentHistoryLoading: false,
  // sessions
  sessions: [], sessionsLoading: false, sessionsError: null,
  
  adminsLoading: false, adminsError: null,
  
  invoices: [], myInvoices: [], currentInvoice: null, invoicesLoading: false, invoicesError: null,
  
  paymentHistory: [], currentReceipt: null, paymentsLoading: false, paymentsError: null,
  // hostels
  hostels: [], currentHostel: null, hostelsLoading: false, hostelsError: null,
  searchResults: [], searchLoading: false,
  
  blocks: [], currentBlock: null, blocksLoading: false, blocksError: null,
  
  floors: [], currentFloor: null, floorsLoading: false, floorsError: null,
  // dashboard
  summaryData: null, summaryLoading: false, summaryError: null,
  reportData: [], reportLoading: false, reportError: null,
  // applications
  myApplications: [], appsLoading: false, appsError: null,
  // notifications
  notifications: [], unreadCount: 0, notificationsLoading: false, notificationsError: null,
};

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
      ...createDashboardSlice(...args),
      ...createApplicationsSlice(...args),
      ...createNotificationsSlice(...args),
      _hasHydrated: false,
    }),
    {
      name: 'hl_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
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

export function resetAllSlices() {
  useStore.setState(initialNonAuthState);
}

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
  forgotPassword: s.forgotPassword,
  resetPassword: s.resetPassword,
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
  availableRoomsForStudent: s.availableRoomsForStudent,
  availableRoomsForStudentLoading: s.availableRoomsForStudentLoading,
  occupants: s.occupants,
  occupantsLoading: s.occupantsLoading,
  studentHistory: s.studentHistory,
  studentHistoryLoading: s.studentHistoryLoading,
  fetchRooms: s.fetchRooms,
  fetchAvailableRooms: s.fetchAvailableRooms,
  fetchAvailableRoomsForStudent: s.fetchAvailableRoomsForStudent,
  pickRoom: s.pickRoom,
  createRoom: s.createRoom,
  bulkCreateRooms: s.bulkCreateRooms,
  updateRoom: s.updateRoom,
  allocateRoom: s.allocateRoom,
  checkoutRoom: s.checkoutRoom,
  reassignRoom: s.reassignRoom,
  fetchOccupants: s.fetchOccupants,
  fetchStudentHistory: s.fetchStudentHistory,
  fetchRoomById: s.fetchRoomById,
  deleteRoom: s.deleteRoom,
  deleteRoomsByBlock: s.deleteRoomsByBlock,
  deleteRoomsByHostel: s.deleteRoomsByHostel,
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
  ownerAdmins: s.ownerAdmins,
  adminsLoading: s.adminsLoading,
  adminsError: s.adminsError,
  createAdmin: s.createAdmin,
  fetchOwnerAdmins: s.fetchOwnerAdmins,
  deleteOwnerAdmin: s.deleteOwnerAdmin,
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
  searchResults: s.searchResults,
  searchLoading: s.searchLoading,
  fetchAllHostels: s.fetchAllHostels,
  fetchHostelById: s.fetchHostelById,
  createHostel: s.createHostel,
  updateHostel: s.updateHostel,
  deleteHostel: s.deleteHostel,
  searchHostels: s.searchHostels,
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
export const useDashboardStore = () => useStore(useShallow((s) => ({
  summaryData: s.summaryData,
  summaryLoading: s.summaryLoading,
  summaryError: s.summaryError,
  reportData: s.reportData,
  reportLoading: s.reportLoading,
  reportError: s.reportError,
  fetchSummaryData: s.fetchSummaryData,
  fetchReport: s.fetchReport,
})));

export const useApplicationsStore = () => useStore(useShallow((s) => ({
  myApplications: s.myApplications,
  appsLoading: s.appsLoading,
  appsError: s.appsError,
  fetchMyApplications: s.fetchMyApplications,
  fetchAllApplications: s.fetchAllApplications,
  applyToHostel: s.applyToHostel,
  approveApplication: s.approveApplication,
  rejectApplication: s.rejectApplication,
})));

export const useNotificationsStore = () => useStore(useShallow((s) => ({
  notifications: s.notifications,
  unreadCount: s.unreadCount,
  notificationsLoading: s.notificationsLoading,
  notificationsError: s.notificationsError,
  fetchNotifications: s.fetchNotifications,
  markAsRead: s.markAsRead,
  markAllAsRead: s.markAllAsRead,
  broadcastAnnouncement: s.broadcastAnnouncement,
  addNotification: s.addNotification,
})));
