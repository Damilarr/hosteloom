"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdPlaylistAdd } from 'react-icons/md';
import type { BulkCreateRoomsPayload } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: BulkCreateRoomsPayload) => Promise<number | false>;
}

export default function BulkCreateRoomsModal({ open, onClose, onSubmit }: Props) {
  const [prefix, setPrefix] = useState('');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(6);
  const [capacity, setCapacity] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefix.trim() || start > end) return;
    setLoading(true);
    const result = await onSubmit({ prefix: prefix.trim(), start, end, capacity });
    setLoading(false);
    if (result !== false) {
      setPrefix('');
      setStart(1);
      setEnd(6);
      setCapacity(4);
      onClose();
    }
  };

  const previewCount = Math.max(0, end - start + 1);
  const previewLabel = prefix.trim()
    ? `${prefix}${start} → ${prefix}${end} (${previewCount} rooms)`
    : `${previewCount} rooms`;

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
                <div className="w-10 h-10 rounded-xl bg-green-400/15 flex items-center justify-center">
                  <MdPlaylistAdd className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-white text-sm">Bulk Create Rooms</p>
                  <p className="text-xs text-hosteloom-muted">Provision a batch of rooms</p>
                </div>
              </div>
              <button onClick={onClose} className="text-hosteloom-muted hover:text-white transition-colors">
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder='e.g. "B"'
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Start</label>
                  <input
                    type="number"
                    min={1}
                    value={start}
                    onChange={(e) => setStart(Number(e.target.value))}
                    className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">End</label>
                  <input
                    type="number"
                    min={1}
                    value={end}
                    onChange={(e) => setEnd(Number(e.target.value))}
                    className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-heading font-medium text-hosteloom-muted mb-1.5">Capacity per room</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
                  required
                />
              </div>

              {prefix.trim() && (
                <div className="text-xs text-hosteloom-muted bg-hosteloom-bg rounded-xl px-3 py-2 border border-hosteloom-border">
                  Preview: <span className="text-white font-medium">{previewLabel}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 text-sm font-heading text-hosteloom-muted hover:text-white border border-hosteloom-border rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 text-sm font-heading font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Creating…' : `Create ${previewCount} Rooms`}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
