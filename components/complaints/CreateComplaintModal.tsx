"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlinedFlag } from 'react-icons/md';
import type { ComplaintCategory, CreateComplaintPayload } from '@/types';

const CATEGORIES: ComplaintCategory[] = ['SECURITY', 'PLUMBING', 'ELECTRICAL', 'OTHER'];

const EMPTY: CreateComplaintPayload = { title: '', description: '', category: 'OTHER' };

interface Props {
  open: boolean;
  onConfirm: (payload: CreateComplaintPayload) => void;
  onClose: () => void;
}

const inputClass =
  'w-full bg-transparent border border-hosteloom-border rounded-xl py-3 px-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm';

export default function CreateComplaintModal({ open, onConfirm, onClose }: Props) {
  const [form, setForm] = useState<CreateComplaintPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onConfirm(form);
    setSubmitting(false);
    setForm(EMPTY);
  };

  const handleClose = () => { if (!submitting) { setForm(EMPTY); onClose(); } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-md space-y-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/15 flex items-center justify-center">
                <MdOutlinedFlag className="w-5 h-5 text-hosteloom-accent" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white text-sm">New Complaint</p>
                <p className="text-xs text-hosteloom-muted">Describe the issue you are facing.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Noisy Neighbors Disrupting Sleep"
                  required
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted uppercase tracking-widest mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-hosteloom-surface text-white">{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted uppercase tracking-widest mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed explanation of the issue…"
                  rows={4}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={handleClose} disabled={submitting}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim() || !form.description.trim()}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-heading font-bold bg-hosteloom-accent hover:bg-hosteloom-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                >
                  {submitting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
