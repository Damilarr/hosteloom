// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'HOSTEL_ADMIN';

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
}

// ─── Admin Profile ────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  hostel: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminProfilePayload = Pick<AdminProfile, 'firstName' | 'lastName' | 'phone' | 'hostel' | 'position'>;

export interface AdminProfileApiResponse {
  message: string;
  profile: AdminProfile;
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
export type ComplaintCategory = 'SECURITY' | 'MAINTENANCE' | 'NOISE' | 'OTHER';

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

// ─── Rooms ───────────────────────────────────────────────────────────────────

export type RoomStatus = 'VACANT' | 'OCCUPIED' | 'FULL';

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface BulkCreateRoomsPayload {
  prefix: string;
  start: number;
  end: number;
  capacity: number;
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
