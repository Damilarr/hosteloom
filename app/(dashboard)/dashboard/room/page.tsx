"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdBedroomParent, MdHistory, MdInfoOutline } from 'react-icons/md';
import { useAuthStore, useRoomsStore } from '@/store';

export default function MyRoomPage() {
  const { user } = useAuthStore();
  const {
    studentHistory,
    studentHistoryLoading,
    fetchStudentHistory,
  } = useRoomsStore();

  useEffect(() => {
    if (user?.id) {
      fetchStudentHistory(user.id);
    }
  }, [user, fetchStudentHistory]);

  const activeAllocation = studentHistory.find((h) => h.status === 'ACTIVE');
  const pastAllocations = studentHistory.filter((h) => h.status !== 'ACTIVE');

  if (studentHistoryLoading && studentHistory.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 w-1/3 bg-hosteloom-surface rounded-2xl" />
        <div className="h-64 bg-hosteloom-surface rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl font-bold">My Room</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">
          View your current room allocation and history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <MdBedroomParent className="text-hosteloom-accent" /> Current Allocation
          </h2>
          
          <AnimatePresence mode="popLayout">
            {activeAllocation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-hosteloom-surface border border-hosteloom-accent/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-hosteloom-accent opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-hosteloom-accent/20 flex items-center justify-center border border-hosteloom-accent/30">
                      <span className="font-heading font-bold text-3xl text-hosteloom-accent">
                        {activeAllocation.room.roomNumber}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-heading font-bold uppercase tracking-widest text-hosteloom-muted mb-1">
                        Academic Session
                      </p>
                      <p className="text-lg font-bold text-white">
                        {activeAllocation.academicSession.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-heading font-bold text-green-400 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-hosteloom-border flex flex-wrap gap-x-12 gap-y-4">
                  <div>
                    <p className="text-xs font-heading text-hosteloom-muted mb-1">Room Capacity</p>
                    <p className="text-sm font-medium text-white">{activeAllocation.room.capacity} Students</p>
                  </div>
                  <div>
                    <p className="text-xs font-heading text-hosteloom-muted mb-1">Allocated On</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(activeAllocation.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-hosteloom-surface border border-hosteloom-border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-hosteloom-bg border border-hosteloom-border flex items-center justify-center">
                  <MdInfoOutline className="w-8 h-8 text-hosteloom-muted" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">No Active Allocation</h3>
                  <p className="text-sm text-hosteloom-muted mt-2 max-w-sm mx-auto">
                    You do not have a room allocated to you for the current academic session. 
                    Please wait for an admin to assign you a room.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <MdHistory className="text-hosteloom-muted" /> History
          </h2>
          
          <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5">
            {pastAllocations.length > 0 ? (
              <div className="space-y-4">
                {pastAllocations.map((allocation) => (
                  <div key={allocation.id} className="pb-4 border-b border-hosteloom-border/50 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-heading font-bold text-white">Room {allocation.room.roomNumber}</p>
                        <p className="text-xs text-hosteloom-muted mt-0.5">{allocation.academicSession.name}</p>
                      </div>
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-hosteloom-muted/10 text-hosteloom-muted">
                        {allocation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-hosteloom-muted text-center py-6">
                No past allocations found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
