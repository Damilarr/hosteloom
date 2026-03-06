"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdOutlinedFlag, MdAdd, MdRefresh } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useComplaintsStore } from '@/store';
import type { ComplaintCategory, ComplaintStatus, CreateComplaintPayload } from '@/types';
import ComplaintCard from '@/components/complaints/ComplaintCard';
import CreateComplaintModal from '@/components/complaints/CreateComplaintModal';

const STATUS_FILTERS: Array<ComplaintStatus | 'ALL'> = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];

export default function StudentComplaintsPage() {
  const { myComplaints, myComplaintsLoading, myComplaintsError, fetchMyComplaints, createComplaint } =
    useComplaintsStore();

  const [filter, setFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchMyComplaints(); }, [fetchMyComplaints]);

  useEffect(() => {
    if (myComplaintsError) {
      toast.error(myComplaintsError);
    }
  }, [myComplaintsError]);

  const visible = filter === 'ALL'
    ? myComplaints
    : myComplaints.filter((c) => c.status === filter);

  const handleCreate = async (payload: CreateComplaintPayload) => {
    const ok = await createComplaint(payload);
    if (ok) { toast.success('Complaint submitted!'); setShowCreate(false); }
    else toast.error('Failed to submit complaint. Please try again.');
  };

  const counts = {
    ALL:         myComplaints.length,
    PENDING:     myComplaints.filter((c) => c.status === 'PENDING').length,
    IN_PROGRESS: myComplaints.filter((c) => c.status === 'IN_PROGRESS').length,
    RESOLVED:    myComplaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Student</p>
          <h1 className="font-heading text-3xl font-bold">My Complaints</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Track and manage your submitted complaints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMyComplaints()}
            disabled={myComplaintsLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
          >
            <MdRefresh className={`w-4 h-4 ${myComplaintsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hosteloom-accent hover:bg-hosteloom-accent-hover text-white text-sm font-heading font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <MdAdd className="w-4 h-4" />
            New Complaint
          </button>
        </div>
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
            {s.replace('_', ' ')} <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>



      {/* Loading skeleton */}
      {myComplaintsLoading && myComplaints.length === 0 && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!myComplaintsLoading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <MdOutlinedFlag className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No complaints yet</p>
            <p className="text-hosteloom-muted text-sm mt-1">
              {filter === 'ALL' ? 'Submit a complaint using the button above.' : `No ${filter.replace('_', ' ').toLowerCase()} complaints.`}
            </p>
          </div>
        </div>
      )}

      {/* List */}
      {visible.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visible.map((complaint) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <ComplaintCard complaint={complaint} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create modal */}
      <CreateComplaintModal
        open={showCreate}
        onConfirm={handleCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
