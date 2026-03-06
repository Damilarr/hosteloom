"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCancel } from 'react-icons/md';
import type { StudentRecord } from '@/types';

interface Props {
  student: StudentRecord | null;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export default function RejectModal({ student, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (student) setReason('');
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <AnimatePresence>
      {student && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-sm space-y-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                <MdCancel className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm">Reject registration</p>
                <p className="text-xs text-hosteloom-muted">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted uppercase tracking-widest mb-2">
                  Reason for rejection
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Incomplete documentation…"
                  rows={3}
                  required
                  autoFocus
                  className="w-full bg-transparent border border-hosteloom-border rounded-xl p-3.5 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim()}
                  className="px-4 py-2 text-sm font-heading font-bold bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                >
                  Reject
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
