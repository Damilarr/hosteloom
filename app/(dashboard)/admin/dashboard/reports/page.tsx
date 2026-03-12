"use client";

import React, { useEffect, useState } from 'react';
import { 
  MdBarChart, MdDownload, MdRefresh, 
  MdBedroomParent, MdPeople, MdPayment, MdBuild 
} from 'react-icons/md';
import { useDashboardStore } from '@/store';
import { Loader } from '@/components/ui/Loader';
import type { ReportType } from '@/types';

const reportTypes: Array<{ type: ReportType; label: string; icon: any; color: string }> = [
  { type: 'occupancy', label: 'Occupancy Status', icon: MdPeople, color: 'text-green-400' },
  { type: 'allocations', label: 'Student Allocations', icon: MdBedroomParent, color: 'text-blue-400' },
  { type: 'payments', label: 'Payment Records', icon: MdPayment, color: 'text-yellow-400' },
  { type: 'maintenance', label: 'Maintenance Issues', icon: MdBuild, color: 'text-orange-400' },
];

export default function ReportsPage() {
  const { reportData, reportLoading, reportError, fetchReport } = useDashboardStore();
  const [activeType, setActiveType] = useState<ReportType>('occupancy');

  useEffect(() => {
    fetchReport(activeType);
  }, [activeType, fetchReport]);

  const handleRefresh = () => fetchReport(activeType);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin Portal</p>
          <h1 className="font-heading text-3xl font-bold">System Reports</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Generate and view detailed hostel management reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={reportLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
          >
            <MdRefresh className={`w-4 h-4 ${reportLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hosteloom-accent hover:bg-hosteloom-accent-hover text-white text-sm font-heading font-bold transition-all"
          >
            <MdDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportTypes.map((rt) => {
          const isActive = activeType === rt.type;
          return (
            <button
              key={rt.type}
              onClick={() => setActiveType(rt.type)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-hosteloom-accent/10 border-hosteloom-accent text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-hosteloom-surface border-hosteloom-border text-hosteloom-muted hover:border-hosteloom-accent/40'
              }`}
            >
              <rt.icon className={`w-6 h-6 ${isActive ? rt.color : 'text-hosteloom-muted'}`} />
              <span className="text-xs font-heading font-bold uppercase tracking-widest">{rt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl overflow-hidden">
        {reportLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader size={32} className="text-hosteloom-accent" />
            <p className="text-sm text-hosteloom-muted font-body animate-pulse">Generating report...</p>
          </div>
        ) : reportError ? (
          <div className="py-20 text-center">
            <p className="text-red-400 font-body text-sm">{reportError}</p>
            <button onClick={handleRefresh} className="mt-4 text-hosteloom-accent text-xs font-heading font-bold uppercase">Try Again</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-hosteloom-bg/50 border-b border-hosteloom-border">
                  {activeType === 'allocations' ? (
                    <>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Student</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Room</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Matric No</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Date</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Status</th>
                    </>
                  ) : activeType === 'payments' ? (
                    <>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Student</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Details</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Date</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Status</th>
                    </>
                  ) : activeType === 'maintenance' ? (
                    <>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Issue</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Category</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Student</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Date</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Room</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Location</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Capacity</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Price</th>
                      <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Allocations</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-hosteloom-border">
                {activeType === 'allocations' ? (
                  (reportData as any[]).map((allocation) => (
                    <tr key={allocation.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-white font-medium">
                            {allocation.student?.profile?.firstName} {allocation.student?.profile?.lastName}
                          </span>
                          <span className="text-[10px] text-hosteloom-muted">{allocation.student?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-white">{allocation.room?.roomNumber}</td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">{allocation.student?.profile?.matricNo}</td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">
                        {new Date(allocation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          allocation.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-hosteloom-muted/10 text-hosteloom-muted'
                        }`}>
                          {allocation.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : activeType === 'payments' ? (
                  (reportData as any[]).map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-white font-medium">
                            {invoice.student?.profile?.firstName} {invoice.student?.profile?.lastName}
                          </span>
                          <span className="text-[10px] text-hosteloom-muted">{invoice.student?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-white">{invoice.allocation?.room?.roomNumber}</span>
                          <span className="text-[10px] text-hosteloom-muted">{invoice.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-white">
                        ₦{Number(invoice.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          invoice.status === 'PAID' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : activeType === 'maintenance' ? (
                  (reportData as any[]).map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-white font-medium">{complaint.title}</span>
                          <span className="text-[10px] text-hosteloom-muted max-w-[200px] truncate">{complaint.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-hosteloom-muted/10 text-hosteloom-muted">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-body text-sm text-white">
                            {complaint.student?.profile?.firstName} {complaint.student?.profile?.lastName}
                          </span>
                          <span className="text-[10px] text-hosteloom-muted">{complaint.student?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          complaint.status === 'RESOLVED' ? 'bg-green-400/10 text-green-400' : 
                          complaint.status === 'IN_PROGRESS' ? 'bg-yellow-400/10 text-yellow-400' : 
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  (reportData as any[]).map((room) => (
                    <tr key={room.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-body text-sm text-white font-medium">{room.roomNumber}</td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">
                        {room.floor?.block?.hostel?.name ? (
                          <>
                            <span className="text-white">{room.floor.block.hostel.name}</span>
                            <br />
                            {room.floor.block.name} — {room.floor.name}
                          </>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-hosteloom-muted">
                        <span className="text-white">{room.allocations?.length ?? 0}</span> / {room.capacity}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-hosteloom-muted">
                        ₦{room.price ? Number(room.price).toLocaleString() : '0'}
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-hosteloom-muted">
                        {room.allocations && room.allocations.length > 0 ? (
                          <div className="flex -space-x-2">
                            {room.allocations.map((a: any, i: number) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-hosteloom-accent border-2 border-hosteloom-surface flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-black/10" title={a.studentId}>
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="opacity-40 italic">No active allocations</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {reportData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center font-body text-sm text-hosteloom-muted">
                      No data found for this report type.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
