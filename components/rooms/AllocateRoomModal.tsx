"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdPersonAdd } from 'react-icons/md';
import type { AllocateRoomPayload, StudentRecord, AvailableRoom } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  students: StudentRecord[];
  availableRooms: AvailableRoom[];
  onSubmit: (payload: AllocateRoomPayload) => Promise<unknown>;
}

export default function AllocateRoomModal({ open, onClose, students, availableRooms, onSubmit }: Props) {
  const [studentId, setStudentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStudentId('');
      setRoomId('');
    }
  }, [open]);

  const approvedStudents = students.filter((s) => s.registrationStatus === 'APPROVED');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !roomId) return;
    setLoading(true);
    const result = await onSubmit({ studentId, roomId });
    setLoading(false);
    if (result) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-md space-y-5"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/15 flex items-center justify-center">
                  <MdPersonAdd className="w-5 h-5 text-hosteloom-accent" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-white text-sm">Allocate Room</p>
                  <p className="text-xs text-hosteloom-muted">Assign a student to a room</p>
                </div>
              </div>
              <button onClick={onClose} className="text-hosteloom-muted hover:text-white transition-colors">
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a student…</option>
                  {approvedStudents.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.firstName} {s.lastName} — {s.matricNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Room</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a room…</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomNumber} — {r.remainingCapacity} of {r.capacity} available
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !studentId || !roomId}
                  className="px-4 py-2 text-sm font-heading font-bold bg-hosteloom-accent hover:bg-hosteloom-accent/80 text-white rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Allocating…' : 'Allocate'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
