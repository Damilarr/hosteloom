"use client";

import React, { useEffect } from 'react';
import { useApplicationsStore, useProfileStore } from '@/store';
import { MdCheckCircle, MdCancel, MdHourglassTop, MdPerson, MdHome } from 'react-icons/md';
import { Loader } from '@/components/ui/Loader';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AdminApplicationsPage() {
  const { adminProfile } = useProfileStore();
  const { 
    myApplications, appsLoading, appsError, 
    fetchAllApplications, approveApplication, rejectApplication 
  } = useApplicationsStore();

  const hostelId = adminProfile?.hostelId;

  useEffect(() => {
    if (hostelId) {
      fetchAllApplications(hostelId);
    }
  }, [fetchAllApplications, hostelId]);

  const handleApprove = async (id: string) => {
    const success = await approveApplication(id);
    if (success) {
      toast.success('Application approved successfully');
    } else {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Please enter a reason for rejection:');
    if (reason === null) return;
    
    const success = await rejectApplication(id, reason);
    if (success) {
      toast.success('Application rejected');
    } else {
      toast.error('Failed to reject application');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Administration</p>
        <h1 className="font-heading text-3xl font-bold text-white">Hostel Applications</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">Review and manage guest applications for your hostel.</p>
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
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-heading font-bold text-sm tracking-widest uppercase flex"
                    >
                      <MdCancel className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-hosteloom-accent hover:text-white rounded-xl transition-all font-heading font-bold text-sm tracking-widest uppercase flex"
                    >
                      <MdCheckCircle className="w-4 h-4" />
                      Approve
                    </button>
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
    </div>
  );
}
