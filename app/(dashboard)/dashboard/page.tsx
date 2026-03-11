"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MdBedroomParent, MdPayment, MdBuild, MdCheckCircle, MdHourglassTop, MdWarning } from 'react-icons/md';
import { FiCreditCard } from 'react-icons/fi';
import { useAuthStore, useProfileStore, useRoomsStore, useComplaintsStore, useInvoicesStore, usePaymentsStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { studentHistory, fetchStudentHistory } = useRoomsStore();
  const { myComplaints, fetchMyComplaints } = useComplaintsStore();
  const { myInvoices, fetchMyInvoices } = useInvoicesStore();
  const { paymentHistory, fetchPaymentHistory } = usePaymentsStore();

  useEffect(() => {
    if (user?.id) {
      fetchStudentHistory(user.id);
    }
    fetchMyComplaints();
    fetchMyInvoices();
    fetchPaymentHistory();
  }, [user, fetchStudentHistory, fetchMyComplaints, fetchMyInvoices, fetchPaymentHistory]);

  // Derived logic
  const activeAllocation = studentHistory.find((h) => h.status === 'ACTIVE');
  const openComplaints = myComplaints.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

  // Payment derivations
  const unpaidInvoices = myInvoices.filter(i => i.status !== 'PAID');
  const paidInvoices = myInvoices.filter(i => i.status === 'PAID');
  const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + parseInt(i.amount, 10), 0);
  const totalPaid = paidInvoices.reduce((sum, i) => sum + parseInt(i.amount, 10), 0);
  const hasUnpaid = unpaidInvoices.length > 0;
  const allPaid = myInvoices.length > 0 && unpaidInvoices.length === 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  // Build recent activity from real data
  const recentActivity: Array<{ icon: React.ElementType; color: string; label: string; sub: string; time: string }> = [];

  // Recent allocation
  if (activeAllocation) {
    recentActivity.push({
      icon: MdCheckCircle,
      color: 'text-green-400',
      label: 'Room allocated',
      sub: `Room ${activeAllocation.room.roomNumber}`,
      time: formatDistanceToNow(new Date(activeAllocation.createdAt), { addSuffix: true }),
    });
  }

  // Recent unpaid invoice
  const latestUnpaid = unpaidInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (latestUnpaid) {
    recentActivity.push({
      icon: MdHourglassTop,
      color: 'text-yellow-400',
      label: 'Payment pending',
      sub: `${formatCurrency(parseInt(latestUnpaid.amount, 10))} due${latestUnpaid.description ? ` — ${latestUnpaid.description}` : ''}`,
      time: formatDistanceToNow(new Date(latestUnpaid.createdAt), { addSuffix: true }),
    });
  }

  // Latest paid invoice
  const latestPaid = paidInvoices.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  if (latestPaid) {
    recentActivity.push({
      icon: MdCheckCircle,
      color: 'text-green-400',
      label: 'Payment confirmed',
      sub: `${formatCurrency(parseInt(latestPaid.amount, 10))}${latestPaid.description ? ` — ${latestPaid.description}` : ''}`,
      time: formatDistanceToNow(new Date(latestPaid.updatedAt), { addSuffix: true }),
    });
  }

  // Recent complaints
  const latestComplaint = [...myComplaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (latestComplaint) {
    recentActivity.push({
      icon: latestComplaint.status === 'RESOLVED' ? MdCheckCircle : MdWarning,
      color: latestComplaint.status === 'RESOLVED' ? 'text-green-400' : 'text-orange-400',
      label: latestComplaint.status === 'RESOLVED' ? 'Complaint resolved' : 'Complaint filed',
      sub: latestComplaint.title,
      time: formatDistanceToNow(new Date(latestComplaint.createdAt), { addSuffix: true }),
    });
  }

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
        <Link href="/dashboard/room" className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors cursor-pointer">
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
        </Link>

        {/* Payment Status — LIVE DATA */}
        <Link href="/dashboard/payments" className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              allPaid ? 'bg-green-400/10' : hasUnpaid ? 'bg-yellow-400/10' : 'bg-hosteloom-muted/10'
            }`}>
              <MdPayment className={`w-5 h-5 ${
                allPaid ? 'text-green-400' : hasUnpaid ? 'text-yellow-400' : 'text-hosteloom-muted'
              }`} />
            </div>
            <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              allPaid ? 'text-green-400 bg-green-400/10' : hasUnpaid ? 'text-yellow-400 bg-yellow-400/10' : 'text-hosteloom-muted bg-hosteloom-muted/10'
            }`}>
              {allPaid ? 'Paid' : hasUnpaid ? 'Pending' : 'No Invoices'}
            </span>
          </div>
          <div>
            <p className="text-xs text-hosteloom-muted font-body uppercase tracking-wider mb-1">Payment Status</p>
            {hasUnpaid ? (
              <>
                <p className="font-heading font-bold text-xl text-white">{formatCurrency(totalUnpaid)}</p>
                <p className="text-xs text-hosteloom-muted mt-0.5">
                  {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length !== 1 ? 's' : ''}
                </p>
              </>
            ) : allPaid ? (
              <>
                <p className="font-heading font-bold text-xl text-white">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-hosteloom-muted mt-0.5">All invoices paid</p>
              </>
            ) : (
              <>
                <p className="font-heading font-bold text-xl text-white">—</p>
                <p className="text-xs text-hosteloom-muted mt-0.5">No invoices yet</p>
              </>
            )}
          </div>
        </Link>

        {/* Maintenance / Complaints */}
        <Link href="/dashboard/complaints" className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-4 hover:border-hosteloom-accent/30 transition-colors cursor-pointer">
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
        </Link>
      </div>

      {/* Recent Activity — LIVE DATA */}
      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
        <h2 className="font-heading font-bold text-lg mb-5">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-hosteloom-muted py-4 text-center">No recent activity to display.</p>
        ) : (
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
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/payments" className="flex items-center gap-4 p-5 bg-hosteloom-surface border border-hosteloom-border rounded-2xl hover:border-hosteloom-accent/40 hover:bg-hosteloom-surface-light transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center">
            <FiCreditCard className="w-5 h-5 text-hosteloom-accent" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-white">View Payments</p>
            <p className="text-xs text-hosteloom-muted">Manage invoices and payment history</p>
          </div>
        </Link>
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
