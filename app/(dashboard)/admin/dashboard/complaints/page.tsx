"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdOutlinedFlag, MdRefresh } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useComplaintsStore } from '@/store';
import type { AdminComplaint, ComplaintStatus } from '@/types';
import AdminComplaintRow from '@/components/complaints/AdminComplaintRow';

const STATUS_FILTERS: Array<ComplaintStatus | 'ALL'> = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];

export default function AdminComplaintsPage() {
  const {
    allComplaints, allComplaintsLoading, allComplaintsError,
    fetchAllComplaints, updateComplaintStatus,
  } = useComplaintsStore();

  const [filter, setFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => { fetchAllComplaints(); }, [fetchAllComplaints]);

  useEffect(() => {
    if (allComplaintsError) {
      toast.error(allComplaintsError);
    }
  }, [allComplaintsError]);

  const visible = filter === 'ALL'
    ? allComplaints
    : allComplaints.filter((c) => c.status === filter);

  const handleStatusChange = async (complaint: AdminComplaint, status: ComplaintStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(complaint.id));
    const ok = await updateComplaintStatus({ complaintId: complaint.id, status });
    setUpdatingIds((prev) => { const n = new Set(prev); n.delete(complaint.id); return n; });
    if (ok) toast.success(`Status updated to ${status.replace('_', ' ')}`);
    else toast.error('Failed to update complaint status');
  };

  const counts = {
    ALL:         allComplaints.length,
    PENDING:     allComplaints.filter((c) => c.status === 'PENDING').length,
    IN_PROGRESS: allComplaints.filter((c) => c.status === 'IN_PROGRESS').length,
    RESOLVED:    allComplaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Complaints</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Review and manage complaints from all students.
          </p>
        </div>
        <button
          onClick={() => fetchAllComplaints()}
          disabled={allComplaintsLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
        >
          <MdRefresh className={`w-4 h-4 ${allComplaintsLoading ? 'animate-spin' : ''}`} />
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
            {s.replace('_', ' ')} <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>



      {/* Loading skeleton */}
      {allComplaintsLoading && allComplaints.length === 0 && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!allComplaintsLoading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <MdOutlinedFlag className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No complaints</p>
            <p className="text-hosteloom-muted text-sm mt-1">
              {filter === 'ALL' ? 'No complaints have been submitted yet.' : `No ${filter.replace('_', ' ').toLowerCase()} complaints.`}
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
                <AdminComplaintRow
                  complaint={complaint}
                  isUpdating={updatingIds.has(complaint.id)}
                  onStatusChange={(status) => handleStatusChange(complaint, status)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
