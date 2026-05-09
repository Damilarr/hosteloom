"use client";

import React, { useState } from 'react';
import { MdClose, MdCampaign, MdSend } from 'react-icons/md';
import { useNotificationsStore } from '@/store';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BroadcastAnnouncementModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { broadcastAnnouncement } = useNotificationsStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setLoading(true);
    const success = await broadcastAnnouncement({ title, message });
    setLoading(false);

    if (success) {
      toast.success('Announcement broadcast successfully');
      setTitle('');
      setMessage('');
      onClose();
    } else {
      toast.error('Failed to broadcast announcement');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-hosteloom-surface border border-hosteloom-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-hosteloom-border flex items-center justify-between bg-hosteloom-surface-light/50">
          <div className="flex items-center gap-3 text-hosteloom-accent">
            <MdCampaign className="w-6 h-6" />
            <h2 className="font-heading font-bold text-lg text-hosteloom-heading">Broadcast</h2>
          </div>
          <button onClick={onClose} className="text-hosteloom-muted hover:text-hosteloom-heading transition-colors">
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted mb-2">
              Announcement Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Maintenance"
              className="w-full bg-hosteloom-surface-light border border-hosteloom-border rounded-xl px-4 py-3 text-sm text-hosteloom-heading focus:border-hosteloom-accent outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted mb-2">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detailed message for all users..."
              rows={4}
              className="w-full bg-hosteloom-surface-light border border-hosteloom-border rounded-xl px-4 py-3 text-sm text-hosteloom-heading focus:border-hosteloom-accent outline-none transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title || !message}
            className="w-full py-3.5 rounded-2xl bg-hosteloom-accent text-white font-heading font-bold text-sm uppercase tracking-widest hover:bg-hosteloom-accent-hover transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Broadcasting...' : (
              <>
                <MdSend className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Broadcast Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
