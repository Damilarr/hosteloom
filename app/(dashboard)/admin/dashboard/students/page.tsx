"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdCheckCircle, MdCancel, MdDelete, MdSearch, MdRefresh } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentsStore } from '@/store';
import type { StudentRecord, RegistrationStatus } from '@/types';
import RejectModal from '@/components/students/RejectModal';
import StudentRow from '@/components/students/StudentRow';

const STATUS_FILTERS: Array<RegistrationStatus | 'ALL'> = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

const statusColor: Record<RegistrationStatus, string> = {
  PENDING:  'bg-yellow-400/15 text-yellow-400',
  APPROVED: 'bg-green-400/15 text-green-400',
  REJECTED: 'bg-red-400/15 text-red-400',
};

export { statusColor };

export default function StudentsPage() {
  const { students, studentsLoading, studentsError, fetchStudents, approveStudent, rejectStudent, deleteStudent } =
    useStudentsStore();

  const [filter, setFilter] = useState<RegistrationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [rejectTarget, setRejectTarget] = useState<StudentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | null>(null);

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const startProcessing = (userId: string) =>
    setProcessingIds((prev) => new Set(prev).add(userId));
  const stopProcessing = (userId: string) =>
    setProcessingIds((prev) => { const next = new Set(prev); next.delete(userId); return next; });

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => {
    if (studentsError) {
      toast.error(studentsError);
    }
  }, [studentsError]);

  const visible = students.filter((s) => {
    const matchStatus = filter === 'ALL' || s.registrationStatus === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      s.matricNo.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleApprove = async (student: StudentRecord) => {
    startProcessing(student.userId);
    const ok = await approveStudent(student.userId);
    stopProcessing(student.userId);
    if (ok) toast.success(`${student.firstName} ${student.lastName} approved`);
    else toast.error('Failed to approve student');
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    startProcessing(rejectTarget.userId);
    const ok = await rejectStudent(rejectTarget.userId, reason);
    stopProcessing(rejectTarget.userId);
    setRejectTarget(null);
    if (ok) toast.success(`${rejectTarget.firstName} ${rejectTarget.lastName} rejected`);
    else toast.error('Failed to reject student');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteStudent(deleteTarget.userId);
    if (ok) toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} removed`);
    else toast.error('Failed to delete student');
    setDeleteTarget(null);
  };

  const counts = {
    ALL:      students.length,
    PENDING:  students.filter((s) => s.registrationStatus === 'PENDING').length,
    APPROVED: students.filter((s) => s.registrationStatus === 'APPROVED').length,
    REJECTED: students.filter((s) => s.registrationStatus === 'REJECTED').length,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Students</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage registrations, approvals and rejections.
          </p>
        </div>
        <button
          onClick={() => fetchStudents()}
          disabled={studentsLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
        >
          <MdRefresh className={`w-4 h-4 ${studentsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all ${
              filter === s
                ? 'bg-hosteloom-accent text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-white'
            }`}
          >
            {s} <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted">
          <MdSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email or matric no…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-hosteloom-surface border border-hosteloom-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
        />
      </div>



      {/* Loading skeleton */}
      {studentsLoading && students.length === 0 && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!studentsLoading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <FiUser className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No students found</p>
            <p className="text-hosteloom-muted text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        </div>
      )}

      {/* Student list */}
      {visible.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visible.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <StudentRow
                  student={student}
                  isProcessing={processingIds.has(student.userId)}
                  onApprove={() => handleApprove(student)}
                  onReject={() => setRejectTarget(student)}
                  onDelete={() => setDeleteTarget(student)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Reject modal */}
      <RejectModal
        student={rejectTarget}
        onConfirm={handleReject}
        onClose={() => setRejectTarget(null)}
      />

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-sm space-y-5"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <MdDelete className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-white text-sm">Delete student</p>
                  <p className="text-xs text-hosteloom-muted">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-hosteloom-muted">
                Are you sure you want to remove{' '}
                <span className="text-white font-medium">
                  {deleteTarget.firstName} {deleteTarget.lastName}
                </span>?
              </p>
              <div className="flex gap-3 justify-end pt-1">
                <button onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="px-4 py-2 text-sm font-heading font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
