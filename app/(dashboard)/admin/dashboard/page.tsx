"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  MdBedroomParent, MdPeople, MdPayment, MdBuild,
  MdCheckCircle, MdHourglassTop, MdPersonAdd, MdWarning,
} from 'react-icons/md';
import { useAuthStore, useRoomsStore, useComplaintsStore, useStudentsStore } from '@/store';

const recentActivity = [
  { icon: MdPersonAdd, color: 'text-hosteloom-accent', label: 'New registration', sub: 'Sarah Okoye — Pending approval', time: '5m ago' },
  { icon: MdCheckCircle, color: 'text-green-400', label: 'Room allocated', sub: 'Block B · Room 12 → John Ade', time: '20m ago' },
  { icon: MdPayment, color: 'text-yellow-400', label: 'Payment verified', sub: '₦150,000 from Chidi Nwosu', time: '1h ago' },
  { icon: MdWarning, color: 'text-orange-400', label: 'Complaint escalated', sub: 'Water supply — Block C', time: '2h ago' },
  { icon: MdHourglassTop, color: 'text-hosteloom-muted', label: 'Overdue payment', sub: 'Tunde Bello — ₦150,000', time: '3h ago' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { rooms, fetchRooms } = useRoomsStore();
  const { allComplaints, fetchAllComplaints } = useComplaintsStore();
  const { students, fetchStudents } = useStudentsStore();

  useEffect(() => {
    fetchRooms();
    fetchAllComplaints();
    fetchStudents();
  }, [fetchRooms, fetchAllComplaints, fetchStudents]);

  // Derived metrics
  const activeRooms = rooms.filter((r) => r.isActive);
  const vacantCount = activeRooms.filter((r) => r.status === 'VACANT').length;
  
  const totalCapacity = activeRooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupancy = activeRooms.reduce((acc, r) => acc + r.occupancyCount, 0);
  const occupancyRate = totalCapacity === 0 ? 0 : Math.round((totalOccupancy / totalCapacity) * 100);

  const openComplaintsCount = allComplaints.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length;
  const pendingComplaintsCount = allComplaints.filter((c) => c.status === 'PENDING').length;

  const actualPendingStudents = students.filter((s) => s.registrationStatus === 'PENDING');

  const metrics = [
    { label: 'Total Rooms', value: activeRooms.length.toString(), sub: `${vacantCount} vacant`, icon: MdBedroomParent, color: 'text-hosteloom-accent', bg: 'bg-hosteloom-accent/10' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, sub: `${totalOccupancy} of ${totalCapacity} filled`, icon: MdPeople, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Revenue This Session', value: '₦4.2M', sub: '12 payments pending', icon: MdPayment, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Open Complaints', value: openComplaintsCount.toString(), sub: `${pendingComplaintsCount} marked pending`, icon: MdBuild, color: 'text-hosteloom-secondary', bg: 'bg-hosteloom-secondary/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin Portal</p>
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">{user?.email}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 hover:border-hosteloom-accent/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-white">{m.value}</p>
            <p className="text-xs text-hosteloom-muted font-body mt-0.5">{m.label}</p>
            <p className="text-[10px] text-hosteloom-muted/70 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
        {/* Recent Activity */}
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg mb-5">Live Activity</h2>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-hosteloom-border last:border-0">
                <div className="w-9 h-9 rounded-full bg-hosteloom-surface-light flex items-center justify-center shrink-0">
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

        {/* Pending Approvals */}
        <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full lg:w-72">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg">Pending Approvals</h2>
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-yellow-400 bg-yellow-400/10">
              {actualPendingStudents.length}
            </span>
          </div>
          <div className="space-y-3">
            {actualPendingStudents.slice(0, 4).map((s) => {
              const name = `${s.firstName} ${s.lastName}`.trim() || 'Unknown';
              const email = s.user?.email || 'No email';
              return (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-hosteloom-surface-light">
                  <div className="w-8 h-8 rounded-full bg-hosteloom-accent/20 flex items-center justify-center font-heading font-bold text-sm text-hosteloom-accent shrink-0">
                    {name && name !== 'Unknown' ? name[0].toUpperCase() : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{name}</p>
                    <p className="text-[10px] text-hosteloom-muted truncate">{email}</p>
                    <p className="text-[10px] text-hosteloom-muted/60 mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {actualPendingStudents.length === 0 && (
              <p className="text-sm text-hosteloom-muted py-4 text-center">No pending students.</p>
            )}
          </div>
          <Link
            href="/admin/dashboard/students"
            className="mt-4 w-full py-2.5 rounded-xl border border-hosteloom-accent/30 text-hosteloom-accent text-xs font-heading font-bold uppercase tracking-widest hover:bg-hosteloom-accent/10 transition-colors flex items-center justify-center text-center"
          >
            Review All
          </Link>
        </div>
      </div>
    </div>
  );
}
