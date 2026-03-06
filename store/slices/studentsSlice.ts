import type { StateCreator } from 'zustand';
import type {
  StudentRecord,
  StudentActionResponse,
  DeleteStudentResponse,
  ApiError,
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface StudentsSlice {
  students: StudentRecord[];
  studentsLoading: boolean;
  studentsError: string | null;

  fetchStudents: () => Promise<void>;
  approveStudent: (userId: string) => Promise<boolean>;
  rejectStudent: (userId: string, reason: string) => Promise<boolean>;
  deleteStudent: (userId: string) => Promise<boolean>;
}

export const createStudentsSlice: StateCreator<StudentsSlice & WithToken, [], [], StudentsSlice> = (set, get) => ({
  students: [],
  studentsLoading: false,
  studentsError: null,

  fetchStudents: async () => {
    set({ studentsLoading: true, studentsError: null });
    try {
      const token = get().token ?? undefined;
      const data = await api.get<StudentRecord[]>('/admin/students', token);
      set({ students: Array.isArray(data) ? data : [], studentsLoading: false });
    } catch (err) {
      set({ studentsLoading: false, studentsError: (err as ApiError).message });
    }
  },

  approveStudent: async (userId) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.post<StudentActionResponse>(
        `/admin/students/${userId}/approve`,
        {},
        token,
      );
      set((state) => ({
        students: state.students.map((s) =>
          s.userId === userId ? { ...s, ...data.profile } : s,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  rejectStudent: async (userId, reason) => {
    try {
      const token = get().token ?? undefined;
      const data = await api.post<StudentActionResponse>(
        `/admin/students/${userId}/reject`,
        { reason },
        token,
      );
      set((state) => ({
        students: state.students.map((s) =>
          s.userId === userId ? { ...s, ...data.profile } : s,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  deleteStudent: async (userId) => {
    try {
      const token = get().token ?? undefined;
      await api.delete<DeleteStudentResponse>(`/admin/students/${userId}`, token);
      set((state) => ({
        students: state.students.filter((s) => s.userId !== userId),
      }));
      return true;
    } catch {
      return false;
    }
  },
});
