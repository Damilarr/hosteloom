"use client";

import React, { useEffect } from 'react';
import { useApplicationsStore, useProfileStore } from '@/store';
import { MdCheckCircle, MdCancel, MdHourglassTop, MdPerson, MdHome } from 'react-icons/md';
import { Loader } from '@/components/ui/Loader';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Tooltip from '@/components/ui/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminApplicationsPage() {
  const { adminProfile } = useProfileStore();
  const { 
    myApplications, appsLoading, appsError, 
    fetchAllApplications, approveApplication, rejectApplication, approveAllApplications 
  } = useApplicationsStore();

  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [processingAction, setProcessingAction] = React.useState<'approve' | 'reject' | 'approve-all' | null>(null);

  const [approveAllModalOpen, setApproveAllModalOpen] = React.useState(false);
  const [rejectModalOpen, setRejectModalOpen] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');

  const hostelId = adminProfile?.hostelId;

  useEffect(() => {
    if (hostelId) {
      fetchAllApplications(hostelId);
    }
  }, [fetchAllApplications, hostelId]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setProcessingAction('approve');
    const success = await approveApplication(id);
    setProcessingId(null);
    setProcessingAction(null);
    if (success) {
      toast.success('Application approved successfully');
    } else {
      toast.error('Failed to approve application');
    }
  };

  const confirmApproveAll = async () => {
    if (!hostelId) return;
    setApproveAllModalOpen(false);

    setProcessingAction('approve-all');
    const success = await approveAllApplications(hostelId);
    setProcessingAction(null);
    
    if (success) {
      toast.success('All pending applications approved successfully');
    } else {
      toast.error('Failed to approve all applications, or no pending applications exist');
    }
  };

  const openRejectModal = (id: string) => {
    setRejectModalOpen(id);
    setRejectReason('');
  };

  const confirmReject = async () => {
    if (!rejectModalOpen || !rejectReason.trim()) return;
    const id = rejectModalOpen;
    setRejectModalOpen(null);
    
    setProcessingId(id);
    setProcessingAction('reject');
    const success = await rejectApplication(id, rejectReason.trim());
    setProcessingId(null);
    setProcessingAction(null);
    if (success) {
      toast.success('Application rejected');
    } else {
      toast.error('Failed to reject application');
    }
  };

  const pendingCount = myApplications.filter(app => app.status === 'PENDING').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Administration</p>
          <h1 className="font-heading text-3xl font-bold text-white">Hostel Applications</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">Review and manage guest applications for your hostel.</p>
        </div>
        
        {pendingCount > 0 && (
          <Tooltip content="Approve all pending applications instantly" position="bottom">
            <button
              onClick={() => setApproveAllModalOpen(true)}
              disabled={!!processingAction || appsLoading}
              className="px-6 py-3 bg-hosteloom-accent text-white hover:bg-hosteloom-accent/80 rounded-xl transition-all font-heading font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              {processingAction === 'approve-all' ? (
                <>
                  <Loader size={16} className="text-white" />
                  Approving All...
                </>
              ) : (
                <>
                  <MdCheckCircle className="w-4 h-4" />
                  Approve All ({pendingCount})
                </>
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {appsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader size={40} className="text-hosteloom-accent" />
          <p className="text-hosteloom-muted font-heading text-sm animate-pulse tracking-widest uppercase">Fetching applications...</p>
        </div>
      ) : appsError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <p className="text-red-400 font-medium">{appsError}</p>
          <button 
            onClick={() => hostelId && fetchAllApplications(hostelId)}
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl transition-all text-sm font-heading font-bold"
          >
            Retry
          </button>
        </div>
      ) : myApplications.length === 0 ? (
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-20 text-center">
          <div className="w-16 h-16 bg-hosteloom-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <MdHourglassTop className="w-8 h-8 text-hosteloom-muted" />
          </div>
          <h3 className="text-white font-heading font-bold text-xl mb-2">No Applications Found</h3>
          <p className="text-hosteloom-muted font-body max-w-sm mx-auto">There are currently no hostel applications to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myApplications.map((app) => (
            <div 
              key={app.id} 
              className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 transition-all hover:border-hosteloom-accent/20 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-hosteloom-bg flex items-center justify-center shrink-0 border border-hosteloom-border group-hover:border-hosteloom-accent/30 transition-colors">
                    <MdPerson className="w-7 h-7 text-hosteloom-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-heading font-bold text-lg flex items-center gap-3">
                      {app.student?.profile 
                        ? `Application: ${app.student.profile.firstName} ${app.student.profile.lastName}`
                        : `Application #${app.id.slice(0, 8)}`
                      }
                      <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                        app.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                        app.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {app.status}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-hosteloom-muted font-body">
                      {app.student?.profile ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <MdPerson className="w-4 h-4" />
                            <span>{app.student.profile.matricNo}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l border-hosteloom-border pl-4">
                            <span>{app.student.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 border-l border-hosteloom-border pl-4">
                            <span>{app.student.profile.phone}</span>
                          </div>
                        </>
                      ) : app.hostel && (
                        <div className="flex items-center gap-1.5">
                          <MdHome className="w-4 h-4" />
                          <span>{app.hostel.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 border-l border-hosteloom-border pl-4">
                        <MdHourglassTop className="w-4 h-4" />
                        <span>Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {app.status === 'PENDING' && (
                  <div className="flex items-center gap-3 lg:pl-10 lg:border-l lg:border-hosteloom-border">
                    <Tooltip content="You'll be asked to provide a rejection reason" position="top">
                      <button
                        onClick={() => openRejectModal(app.id)}
                        disabled={!!processingId || appsLoading}
                        className="flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-heading font-bold text-sm tracking-widest uppercase flex disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === app.id && processingAction === 'reject' ? (
                          <>
                            <Loader size={16} />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <MdCancel className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </Tooltip>
                    <Tooltip content="Approve this student's hostel application" position="top">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={!!processingId || appsLoading}
                        className="flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-hosteloom-accent hover:text-white rounded-xl transition-all font-heading font-bold text-sm tracking-widest uppercase flex disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === app.id && processingAction === 'approve' ? (
                          <>
                            <Loader size={16} />
                            Approving...
                          </>
                        ) : (
                          <>
                            <MdCheckCircle className="w-4 h-4" />
                            Approve
                          </>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                )}
                
                {app.status === 'REJECTED' && app.rejectionReason && (
                    <div className="lg:pl-10 lg:border-l lg:border-hosteloom-border max-w-xs">
                        <p className="text-[10px] text-hosteloom-muted uppercase font-heading font-bold tracking-widest mb-1">Reason for rejection</p>
                        <p className="text-sm text-red-400 font-body italic">"{app.rejectionReason}"</p>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {approveAllModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="font-heading font-bold text-xl text-white mb-2">Approve All Pending?</h3>
              <p className="text-hosteloom-muted text-sm font-body mb-6">
                Are you sure you want to approve all {pendingCount} pending applications at once? This action cannot be easily undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setApproveAllModalOpen(false)}
                  className="px-4 py-2 border border-hosteloom-border text-white hover:bg-hosteloom-surface-light rounded-xl text-sm font-heading font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproveAll}
                  className="px-4 py-2 bg-hosteloom-accent text-white hover:bg-hosteloom-accent/80 rounded-xl text-sm font-heading font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  Yes, Approve All
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="font-heading font-bold text-xl text-white mb-2">Reject Application</h3>
              <p className="text-hosteloom-muted text-sm font-body mb-4">
                Please provide a reason for rejecting this application. This reason will be recorded and shared with the applicant.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g., No available spaces for your academic level."
                className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-body mb-6 min-h-[100px] resize-none"
              />
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setRejectModalOpen(null)}
                  className="px-4 py-2 border border-hosteloom-border text-white hover:bg-hosteloom-surface-light rounded-xl text-sm font-heading font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-sm font-heading font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
