"use client";

import React, { useEffect } from 'react';
import { useAuthStore, useHostelsStore, useDashboardStore } from '@/store';
import { MdBedroomParent, MdPeople, MdPayment, MdHome } from 'react-icons/md';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const { hostels, fetchAllHostels } = useHostelsStore();
  const { summaryData, summaryLoading, fetchSummaryData } = useDashboardStore();

  useEffect(() => {
    fetchAllHostels();
    fetchSummaryData();
  }, [fetchAllHostels, fetchSummaryData]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Owner Portal</p>
          <h1 className="font-heading text-3xl font-bold">Hostel Owner 👋</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hostels', value: summaryData?.totalHostels.toString() ?? hostels.length.toString(), sub: 'Managed properties', icon: MdHome, color: 'text-hosteloom-accent', bg: 'bg-hosteloom-accent/10' },
          { label: 'Total Rooms', value: summaryData?.totalRooms.toString() ?? '0', sub: `${summaryData?.capacity.vacantRooms ?? 0} vacant`, icon: MdBedroomParent, color: 'text-blue-600', bg: 'bg-blue-400/10' },
          { label: 'Occupancy Rate', value: `${summaryData?.capacity.occupancyRatePercentage ?? 0}%`, sub: `${summaryData?.capacity.occupiedBeds ?? 0} beds filled`, icon: MdPeople, color: 'text-emerald-600', bg: 'bg-green-400/10' },
          { label: 'Total Revenue', value: `₦${((summaryData?.financials.totalRevenue ?? 0) / 1000000).toFixed(1)}M`, sub: `${summaryData?.financials.pendingPayments ? `₦${summaryData.financials.pendingPayments.toLocaleString()} pending` : 'No pending payments'}`, icon: MdPayment, color: 'text-amber-600', bg: 'bg-yellow-400/10' },
        ].map((m) => (
          <div key={m.label} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 hover:border-hosteloom-accent/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-hosteloom-heading">{summaryData ? m.value : '—'}</p>
            <p className="text-xs text-hosteloom-muted font-body mt-0.5">{m.label}</p>
            <p className="text-[10px] text-hosteloom-muted/70 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-8">
         <h2 className="font-heading font-bold text-xl mb-4">Welcome to your Owner Dashboard</h2>
         <p className="text-hosteloom-muted font-body text-sm">
           From here you can oversee your properties and navigate to the 'Admins' page to manage access for your daily operations.
         </p>
      </div>
    </div>
  );
}
