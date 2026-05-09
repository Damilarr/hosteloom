"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdWarning } from 'react-icons/md';
import { toast } from 'sonner';
import { useRoomsStore, useHostelsStore } from '@/store';

interface Props {
  open: boolean;
  onClose: () => void;
  targetType: 'BLOCK' | 'HOSTEL';
  hostelId: string | null;
}

export default function DeleteRoomsWarningModal({ open, onClose, targetType, hostelId }: Props) {
  const { deleteRoomsByBlock, deleteRoomsByHostel } = useRoomsStore();
  const { currentHostel } = useHostelsStore();
  
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (!open) return null;

  const title = targetType === 'BLOCK' ? 'Delete Rooms By Block' : 'Delete All Hostel Rooms';
  const warningMsg = targetType === 'BLOCK' 
    ? 'This will permanently delete ALL rooms within the selected block. This action cannot be undone.'
    : 'This will permanently delete ALL rooms in this hostel. This action cannot be undone.';
  
  const confirmWord = 'DELETE';

  const handleDelete = async () => {
    if (confirmText !== confirmWord) {
      toast.error('Please type DELETE to confirm');
      return;
    }
    
    if (targetType === 'BLOCK' && !selectedBlockId) {
      toast.error('Please select a block');
      return;
    }

    if (targetType === 'HOSTEL' && !hostelId) {
      toast.error('Operating hostel context is missing');
      return;
    }

    setLoading(true);
    let ok = false;

    if (targetType === 'BLOCK') {
      ok = await deleteRoomsByBlock(selectedBlockId);
      if (ok) toast.success('Rooms in block deleted successfully');
    } else {
      ok = await deleteRoomsByHostel(hostelId!);
      if (ok) toast.success('All hostel rooms deleted successfully');
    }

    setLoading(false);
    if (ok) {
      setConfirmText('');
      setSelectedBlockId('');
      onClose();
    } else {
      toast.error('Failed to delete rooms');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-hosteloom-surface border border-red-500/30 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(239,68,68,0.1)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-hosteloom-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <MdWarning className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="font-heading font-bold text-lg text-hosteloom-heading">{title}</h2>
            </div>
            <button onClick={onClose} className="text-hosteloom-muted hover:text-hosteloom-heading transition-colors">
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            <p className="text-sm font-body text-hosteloom-muted leading-relaxed">
              {warningMsg}
            </p>

            {targetType === 'BLOCK' && currentHostel?.blocks && (
              <div className="space-y-1">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-hosteloom-muted">
                  Select Block
                </label>
                <select
                  value={selectedBlockId}
                  onChange={(e) => setSelectedBlockId(e.target.value)}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-hosteloom-heading text-sm focus:outline-none focus:border-red-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose a block...</option>
                  {currentHostel.blocks.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-heading font-bold uppercase tracking-wider text-hosteloom-muted flex gap-1">
                Type <span className="text-red-400 select-none">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-hosteloom-heading placeholder:text-hosteloom-muted focus:outline-none focus:border-red-400 transition-all font-body text-sm"
              />
            </div>

            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== confirmWord || (targetType === 'BLOCK' && !selectedBlockId)}
              className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-heading font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                'Permanently Delete Rooms'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
