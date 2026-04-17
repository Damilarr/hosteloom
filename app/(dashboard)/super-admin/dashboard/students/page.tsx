'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { StudentRecord, UserProfile } from '@/types';
import { toast } from 'sonner';
import { FiUsers, FiUser, FiInfo, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function SuperAdminStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get<{ data: StudentRecord[] }>('/users/students');
      setStudents(res.data || []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch students list');
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = (student: StudentRecord) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
            Super Admin
          </p>
          <h1 className="font-heading text-3xl font-bold">Students Visibility</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Global monitoring of all students and dynamic profiles exploration.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-hosteloom-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No students found</p>
            <p className="text-hosteloom-muted text-sm mt-1">
              There are no registered students to display dynamically.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {students.map(student => {
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3 }}
                  className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col hover:border-hosteloom-accent/40 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-bold text-white mb-0.5">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs text-hosteloom-muted truncate">{student.user?.email || 'No email associated'}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      student.hostel ? 'bg-green-400/10 text-green-400' : 'bg-hosteloom-muted/10 text-hosteloom-muted'
                    }`}>
                      {student.hostel ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex gap-2 font-mono text-xs text-hosteloom-muted">
                    <span className="bg-hosteloom-bg px-2 py-1 rounded">{student.matricNo || 'N/A'}</span>
                    <span className="bg-hosteloom-bg px-2 py-1 rounded">{student.academicLevel || 'N/A'} Level</span>
                  </div>

                  <div className="mt-5 pt-4 border-t border-hosteloom-border flex justify-end">
                    <button
                      onClick={() => viewProfile(student)}
                      className="text-xs font-heading font-semibold text-white bg-hosteloom-bg border border-hosteloom-border px-4 py-2 rounded-lg hover:border-hosteloom-accent hover:text-hosteloom-accent transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiInfo className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }} 
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl bg-hosteloom-surface border border-hosteloom-border overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b border-hosteloom-border flex justify-between items-center bg-hosteloom-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-hosteloom-accent/20 flex items-center justify-center text-hosteloom-accent">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl text-white">Student Profile</h2>
                    <p className="text-xs text-hosteloom-muted">Information for ID: {selectedStudent.userId}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 text-hosteloom-muted hover:text-white rounded-xl hover:bg-hosteloom-border/50 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm text-white font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Matric Number</p>
                  <p className="text-sm text-white font-mono">{selectedStudent.matricNo}</p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Institution</p>
                  <p className="text-sm text-white">{selectedStudent.school}</p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Academic Level</p>
                  <p className="text-sm text-white font-mono">{selectedStudent.academicLevel}L</p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Hostel</p>
                  <p className="text-sm text-white truncate" title={selectedStudent.hostel ? selectedStudent.hostel.name : 'Not Assigned'}>
                    {selectedStudent.hostel ? selectedStudent.hostel.name : 'Not Assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-hosteloom-muted uppercase tracking-widest mb-1">Account Creation</p>
                  <p className="text-sm text-white">{selectedStudent.createdAt ? format(new Date(selectedStudent.createdAt), 'PPpp') : 'Unknown'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
