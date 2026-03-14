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
      const data = await api.get<StudentRecord[]>('/users/students', token);
      set({ students: Array.isArray(data) ? data : [], studentsLoading: false });
    } catch (err) {
      set({ studentsLoading: false, studentsError: (err as ApiError).message });
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
