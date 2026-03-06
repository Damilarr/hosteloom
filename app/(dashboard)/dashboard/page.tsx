"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MdBedroomParent, MdPayment, MdBuild, MdCheckCircle, MdHourglassTop, MdWarning } from 'react-icons/md';
import { useAuthStore, useProfileStore, useRoomsStore, useComplaintsStore } from '@/store';

const recentActivity = [
  { icon: MdCheckCircle, color: 'text-green-400', label: 'Room allocated', sub: 'Block A · Room 204', time: '2 days ago' },
  { icon: MdHourglassTop, color: 'text-yellow-400', label: 'Payment pending', sub: '₦150,000 due — Session 2025/2026', time: '1 week ago' },
  { icon: MdWarning, color: 'text-orange-400', label: 'Maintenance filed', sub: 'Broken window latch', time: '3 days ago' },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { studentHistory, fetchStudentHistory } = useRoomsStore();
  const { myComplaints, fetchMyComplaints } = useComplaintsStore();

  useEffect(() => {
    if (user?.id) {
      fetchStudentHistory(user.id);
    }
    fetchMyComplaints();
  }, [user, fetchStudentHistory, fetchMyComplaints]);

  // Derived logic
  const activeAllocation = studentHistory.find((h) => h.status === 'ACTIVE');
  const openComplaints = myComplaints.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Student Portal</p>
        <h1 className="font-heading text-3xl font-bold">
          {greeting}{profile?.firstName ? `, ${profile.firstName}` : ''} 👋
        </h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">{user?.email}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Room Status */}
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center`}>
              <MdBedroomParent className="w-5 h-5 text-hosteloom-accent" />
            </div>
            <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${activeAllocation ? 'text-green-400 bg-green-400/10' : 'text-hosteloom-muted bg-hosteloom-muted/10'}`}>
              {activeAllocation ? 'Active' : 'Not Assigned'}
            </span>
          </div>
          <div>
            <p className="text-xs text-hosteloom-muted font-body uppercase tracking-wider mb-1">Room Status</p>
            <p className="font-heading font-bold text-xl text-white">
              {activeAllocation ? 'Allocated' : 'No Room'}
            </p>
            <p className="text-xs text-hosteloom-muted mt-0.5">
              {activeAllocation ? `Room ${activeAllocation.room.roomNumber}` : 'Waiting for allocation'}
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center`}>
              <MdPayment className={`w-5 h-5 text-yellow-400`} />
            </div>
            <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-yellow-400 bg-yellow-400/10`}>
              Pending
            </span>
          </div>
          <div>
            <p className="text-xs text-hosteloom-muted font-body uppercase tracking-wider mb-1">Payment Status</p>
            <p className="font-heading font-bold text-xl text-white">₦150,000</p>
            <p className="text-xs text-hosteloom-muted mt-0.5">Session 2025/2026</p>
          </div>
        </div>

        {/* Maintenance / Complaints */}
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl bg-hosteloom-secondary/10 flex items-center justify-center`}>
              <MdBuild className={`w-5 h-5 text-hosteloom-secondary`} />
            </div>
            <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${openComplaints.length > 0 ? 'text-orange-400 bg-orange-400/10' : 'text-hosteloom-muted bg-hosteloom-muted/10'}`}>
              {openComplaints.length > 0 ? 'In Progress' : 'All Clear'}
            </span>
          </div>
          <div>
            <p className="text-xs text-hosteloom-muted font-body uppercase tracking-wider mb-1">Complaints</p>
            <p className="font-heading font-bold text-xl text-white">
              {openComplaints.length} Open
            </p>
            <p className="text-xs text-hosteloom-muted mt-0.5">
              {openComplaints.length > 0 ? `${openComplaints.length} active request${openComplaints.length !== 1 ? 's' : ''}` : 'No open complaints'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
        <h2 className="font-heading font-bold text-lg mb-5">Recent Activity</h2>
        <div className="space-y-1">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-hosteloom-border last:border-0"
            >
              <div className={`w-9 h-9 rounded-full bg-hosteloom-surface-light flex items-center justify-center shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.label}</p>
                <p className="text-xs text-hosteloom-muted truncate">{item.sub}</p>
              </div>
              <span className="text-[10px] text-hosteloom-muted whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center gap-4 p-5 bg-hosteloom-surface border border-hosteloom-border rounded-2xl hover:border-hosteloom-accent/40 hover:bg-hosteloom-surface-light transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center">
            <MdPayment className="w-5 h-5 text-hosteloom-accent" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-white">Make a Payment</p>
            <p className="text-xs text-hosteloom-muted">Record or upload your payment receipt</p>
          </div>
        </button>
        <Link href="/dashboard/complaints" className="flex items-center gap-4 p-5 bg-hosteloom-surface border border-hosteloom-border rounded-2xl hover:border-hosteloom-secondary/40 hover:bg-hosteloom-surface-light transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-hosteloom-secondary/10 flex items-center justify-center">
            <MdBuild className="w-5 h-5 text-hosteloom-secondary" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-white">Report an Issue</p>
            <p className="text-xs text-hosteloom-muted">Submit a maintenance or complaint request</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
