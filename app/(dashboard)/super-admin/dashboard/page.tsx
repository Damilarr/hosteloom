'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { FiActivity, FiUsers, FiHome, FiServer } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SuperAdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get<{ data: any }>('/dashboard/super-admin/summary');
      setSummary(res.data || res);
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
            Super Admin
          </p>
          <h1 className="font-heading text-3xl font-bold">System Overview</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Global system statistics and metrics.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* Mocked/Loosely bound cards to gracefully handle unknown summary structure */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FiHome className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-heading text-hosteloom-muted font-bold truncate">Total Hostels</p>
                <p className="text-xl md:text-2xl font-bold font-heading text-white mt-1 truncate">
                  {summary?.totalHostels ?? '--'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FiUsers className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-heading text-hosteloom-muted font-bold truncate">Total Students</p>
                <p className="text-xl md:text-2xl font-bold font-heading text-white mt-1 truncate">
                  {summary?.totalStudents ?? '--'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                <FiActivity className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-heading text-hosteloom-muted font-bold truncate">Registered Owners</p>
                <p className="text-xl md:text-2xl font-bold font-heading text-white mt-1 truncate">
                  {summary?.totalOwners ?? '--'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                <FiServer className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-heading text-hosteloom-muted font-bold truncate" title="Total Platform Revenue">Total Platform Revenue</p>
                <p className="text-lg md:text-xl font-bold font-heading text-white mt-1 truncate" title={summary?.financials?.totalPlatformRevenue ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(summary.financials.totalPlatformRevenue) : '--'}>
                  {summary?.financials?.totalPlatformRevenue !== undefined 
                    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(summary.financials.totalPlatformRevenue) 
                    : '--'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <FiActivity className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-heading text-hosteloom-muted font-bold truncate" title="Total Invoiced (Platform)">Total Invoiced (Platform)</p>
                <p className="text-lg md:text-xl font-bold font-heading text-white mt-1 truncate" title={summary?.financials?.totalPlatformInvoiced ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(summary.financials.totalPlatformInvoiced) : '--'}>
                  {summary?.financials?.totalPlatformInvoiced !== undefined 
                    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(summary.financials.totalPlatformInvoiced) 
                    : '--'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
