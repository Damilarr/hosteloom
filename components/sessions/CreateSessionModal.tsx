"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdDateRange } from 'react-icons/md';
import type { CreateSessionPayload } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSessionPayload) => Promise<boolean>;
}

export default function CreateSessionModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const ok = await onSubmit({ name: name.trim() });
    setLoading(false);
    if (ok) {
      setName('');
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
            className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-sm space-y-5"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/15 flex items-center justify-center">
                  <MdDateRange className="w-5 h-5 text-hosteloom-accent" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-white text-sm">Create Session</p>
                  <p className="text-xs text-hosteloom-muted">Add a new academic session</p>
                </div>
              </div>
              <button onClick={onClose} className="text-hosteloom-muted hover:text-white transition-colors">
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Session Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 2025/2026"
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
                  required
                />
                <p className="text-[10px] text-hosteloom-muted mt-1.5">Usually in the format YYYY/YYYY representing the academic year.</p>
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 text-sm font-heading font-bold bg-hosteloom-accent hover:bg-hosteloom-accent/80 text-white rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
