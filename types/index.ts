// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'HOSTEL_ADMIN' | 'HOSTEL_OWNER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  school: string;
  matricNo: string;
  academicLevel: string;
  registrationStatus: RegistrationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProfilePayload = Omit<
  UserProfile,
  'id' | 'userId' | 'registrationStatus' | 'rejectionReason' | 'createdAt' | 'updatedAt'
>;

export interface ProfileApiResponse {
  message: string;
  profile: UserProfile;
}

export interface UnifiedProfileResponse {
  user: User;
  profile: UserProfile | null;
  adminProfile: AdminProfile | null;
  ownerProfile: OwnerProfile | null;
}

// ─── Admin Profile ────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  hostelId: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminProfilePayload = Pick<AdminProfile, 'firstName' | 'lastName' | 'phone' | 'position'>;

export interface AdminProfileApiResponse {
  message: string;
  profile: AdminProfile;
}

export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  hostelId: string;
}

export interface CreateAdminResponse {
  message: string;
  admin: User;
  profile: AdminProfile;
}

// ─── Owner Profile ────────────────────────────────────────────────────────────

export interface OwnerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export type OwnerProfilePayload = Pick<OwnerProfile, 'firstName' | 'lastName' | 'phone' | 'companyName'>;

export interface OwnerProfileApiResponse {
  message: string;
  profile: OwnerProfile;
}

// ─── Admin → Students ─────────────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  school: string;
  matricNo: string;
  academicLevel: string;
  registrationStatus: RegistrationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: { email: string };
}

export interface StudentsListResponse {
  message?: string;
  students: StudentRecord[];
}

export interface StudentActionResponse {
  message: string;
  profile: StudentRecord;
}

export interface DeleteStudentResponse {
  message: string;
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
export type ComplaintCategory = 'SECURITY' | 'PLUMBING' | 'ELECTRICAL' | 'OTHER';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminComplaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  category?: ComplaintCategory;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
}

export interface UpdateComplaintStatusPayload {
  complaintId: string;
  status: ComplaintStatus;
}

// ─── Hostels, Blocks, Floors ───────────────────────────────────────────────────

export interface Hostel {
  id: string;
  name: string;
  description: string;
  address: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export interface CreateHostelPayload {
  name: string;
  description: string;
  address: string;
}

export interface UpdateHostelPayload {
  name?: string;
  description?: string;
  address?: string;
}

export interface Block {
  id: string;
  name: string;
  hostelId: string;
  createdAt: string;
  updatedAt: string;
  hostel?: Hostel;
  floors?: Floor[];
}

export interface CreateBlockPayload {
  name: string;
  hostelId: string;
}

export interface UpdateBlockPayload {
  name: string;
}

export interface Floor {
  id: string;
  name: string;
  blockId: string;
  createdAt: string;
  updatedAt: string;
  block?: Block;
  rooms?: Room[];
}

export interface CreateFloorPayload {
  name: string;
  blockId: string;
}

export interface UpdateFloorPayload {
  name: string;
}

// ─── Rooms ───────────────────────────────────────────────────────────────────

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export type RoomStatus = 'VACANT' | 'OCCUPIED' | 'FULL';

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  price?: string;
  isActive: boolean;
  floorId?: string;
  createdAt: string;
  updatedAt: string;
  floor?: Floor;
}

export interface Allocation {
  id: string;
  status: 'ACTIVE' | 'COMPLETED';
  studentId: string;
  roomId: string;
  academicSessionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomWithDetails extends Room {
  allocations: Allocation[];
  occupancyCount: number;
  status: RoomStatus;
}

export interface AvailableRoom extends Room {
  allocations: Allocation[];
  occupancy: number;
  remainingCapacity: number;
}

export interface CreateRoomPayload {
  roomNumber: string;
  capacity: number;
  price: number;
  floorId: string;
}

export interface BulkCreateRoomsPayload {
  prefix: string;
  start: number;
  end: number;
  capacity: number;
  price: number;
  floorId: string;
}

export interface BulkCreateRoomsResponse {
  count: number;
}

export interface UpdateRoomPayload {
  isActive?: boolean;
  capacity?: number;
}

// ─── Allocations ─────────────────────────────────────────────────────────────

export interface AllocationStudent {
  id: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    matricNo: string;
    school?: string;
    academicLevel: string;
    registrationStatus: string;
  };
}

export interface AllocationRoom {
  id: string;
  roomNumber: string;
  capacity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllocationSession {
  id: string;
  name: string;
  isActive: boolean;
}

export interface AllocationWithDetails extends Allocation {
  room: AllocationRoom;
  student: AllocationStudent;
  academicSession?: AllocationSession;
}

export interface AllocateRoomPayload {
  studentId: string;
  roomId: string;
}

export interface AllocateRoomResponse {
  message: string;
  allocation: AllocationWithDetails;
}

export interface CheckoutResponse {
  message: string;
  allocation: AllocationWithDetails;
}

export interface ReassignRoomPayload {
  studentId: string;
  newRoomId: string;
}

export interface ReassignRoomResponse {
  message: string;
  allocation: AllocationWithDetails;
}

export interface OccupantAllocation extends Allocation {
  student: AllocationStudent & {
    createdAt?: string;
    updatedAt?: string;
    profile: AllocationStudent['profile'] & {
      id?: string;
      phone?: string;
      userId?: string;
      createdAt?: string;
      updatedAt?: string;
      rejectionReason?: string | null;
    };
  };
}

export interface AllocationHistoryEntry extends Allocation {
  room: AllocationRoom;
  academicSession: AllocationSession & {
    createdAt?: string;
    updatedAt?: string;
  };
}

// ─── Academic Sessions ───────────────────────────────────────────────────────

export interface AcademicSession {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  name: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode?: number;
}
// ─── Invoices ────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  amount: string;
  description: string;
  dueDate: string;
  status: InvoiceStatus;
  studentId: string;
  allocationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceWithDetails extends Invoice {
  student?: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      matricNo: string;
    };
  };
  allocation?: {
    id: string;
    status: string;
    studentId: string;
    roomId: string;
    academicSessionId: string;
    createdAt: string;
    updatedAt: string;
    room: {
      id?: string;
      roomNumber: string;
      capacity: number;
      price: string;
      isActive?: boolean;
      floorId?: string;
    };
  };
  payments?: Payment[];
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface PaymentReceiptData {
  paidAt?: string;
  channel?: string;
  currency?: string;
  paystackRef?: string;
  customerEmail?: string;
}

export interface Payment {
  id: string;
  amount: string;
  reference: string;
  paystackId: string | null;
  status: PaymentStatus;
  receiptData: PaymentReceiptData | null;
  studentId: string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
  student?: {
    email: string;
    profile: UserProfile;
  };
  refund?: any; 
}

export interface InitializePaymentPayload {
  invoiceId: string;
  amount: number;
  email: string;
  callback_url: string;
}

export interface InitializePaymentResponse {
  message: string;
  payment: {
    id: string;
    amount: string;
    reference: string;
    paystackId: string | null;
    status: PaymentStatus;
    receiptData: PaymentReceiptData | null;
    studentId: string;
    invoiceId: string;
    createdAt: string;
    updatedAt: string;
  };
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  message?: string;
  status?: string; 
  data?: any;
}
// ─── Dashboard & Reports ─────────────────────────────────────────────────────

export interface DashboardSummary {
  totalHostels: number;
  totalRooms: number;
  totalStudents: number;
  capacity: {
    totalBeds: number;
    occupiedBeds: number;
    vacantBeds: number;
    occupiedRooms: number;
    vacantRooms: number;
    occupancyRatePercentage: number;
  };
  financials: {
    totalRevenue: number;
    pendingPayments: number;
  };
}

export type ReportType = 'allocations' | 'payments' | 'maintenance' | 'occupancy';

export interface ReportRoomData extends Omit<Room, 'floor'> {
  allocations: Allocation[];
  floor?: {
    id: string;
    name: string;
    blockId: string;
    createdAt?: string;
    updatedAt?: string;
    block?: {
      id: string;
      name: string;
      hostelId: string;
      createdAt?: string;
      updatedAt?: string;
      hostel?: {
        id: string;
        name: string;
        description: string;
        address: string;
        ownerId: string;
        createdAt?: string;
        updatedAt?: string;
      };
    };
  };
}

export interface DashboardSummaryResponse {
  message: string;
  data: DashboardSummary;
}

export interface ReportAllocationData {
  id: string;
  status: string;
  studentId: string;
  roomId: string;
  academicSessionId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    profile: UserProfile;
    email: string;
  };
  room: ReportRoomData;
}

export interface ReportPaymentData {
  id: string;
  amount: string;
  description: string;
  dueDate: string;
  status: string;
  studentId: string;
  allocationId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    profile: UserProfile;
    email: string;
  };
  allocation: {
    id: string;
    status: string;
    studentId: string;
    roomId: string;
    academicSessionId: string;
    createdAt: string;
    updatedAt: string;
    room: Room;
  };
  payments: Array<{
    id: string;
    amount: string;
    reference: string;
    paystackId: string;
    status: string;
    receiptData: any;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ReportMaintenanceData {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  student: {
    profile: UserProfile;
    email: string;
  };
}

export interface DashboardReportResponse {
  message: string;
  data: ReportRoomData[] | ReportAllocationData[] | ReportPaymentData[] | ReportMaintenanceData[];
}
