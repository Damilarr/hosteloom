'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function BroadcastAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await api.post('/broadcast-announcement', { title, message });
      toast.success('Announcement broadcasted globally successfully!');
      setTitle('');
      setMessage('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to broadcast announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
          Super Admin
        </p>
        <h1 className="font-heading text-3xl font-bold">Global Announcements</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">
          Broadcast alerts and messages globally to all users on the platform.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 md:p-8">
        <form onSubmit={handleBroadcast} className="space-y-6">
          <div>
            <label className="block text-sm font-heading font-medium text-hosteloom-heading mb-2">Subject</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-hosteloom-heading transition-colors">
                <FiMessageSquare className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                placeholder="Alert Subject" 
                className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl pl-10 pr-4 py-3 text-sm text-hosteloom-heading placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:ring-1 focus:ring-hosteloom-accent transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-hosteloom-heading mb-2">Message Payload</label>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              required 
              rows={6} 
              placeholder="Detail your broadcast message here..." 
              className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl p-4 text-sm text-hosteloom-heading placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:ring-1 focus:ring-hosteloom-accent transition-all resize-none" 
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !message.trim()}
            className="w-full py-3.5 bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-hosteloom-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-hosteloom-accent/20"
          >
            {loading ? 'Broadcasting...' : (
              <>
                <FiSend className="w-4 h-4" /> Send Global Alert
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
