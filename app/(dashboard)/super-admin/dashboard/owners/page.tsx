'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { OwnerProfile } from '@/types';
import { toast } from 'sonner';
import { FiCheckCircle, FiXCircle, FiMonitor } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminOwnerData {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  status?: string;
  verificationStatus?: string;
  userId?: string;
  user?: {
    email: string;
  };
}

export default function SuperAdminOwnersPage() {
  const [owners, setOwners] = useState<AdminOwnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      // Trying common endpoints just in case, but usually /super-admin/owners
      const res = await api.get<any>('/super-admin/owners');
      setOwners(Array.isArray(res) ? res : (res.owners || res.data || []));
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch hostel owners');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (owner: AdminOwnerData) => {
    const isCurrentlyVerified = owner.verificationStatus === 'VERIFIED' || owner.status === 'VERIFIED';
    const newStatus = isCurrentlyVerified ? 'PENDING' : 'VERIFIED';
    const originalVerificationStatus = owner.verificationStatus;
    const originalStatus = owner.status;

    // Optimistic update
    setOwners(prev =>
      prev.map(o => (o.id === owner.id ? { ...o, verificationStatus: newStatus, status: newStatus } : o))
    );
    setTogglingId(owner.id);

    try {
      await api.patch(`/super-admin/verify-owner/${owner.id}`, {
        status: newStatus,
      });
      toast.success(
        `Owner ${owner.name || owner.firstName || 'Unknown'} has been manually ${
          newStatus === 'VERIFIED' ? 'verified' : 'unverified'
        }.`
      );
    } catch (e: any) {
      // Rollback
      setOwners(prev =>
        prev.map(o => (o.id === owner.id ? { ...o, verificationStatus: originalVerificationStatus, status: originalStatus } : o))
      );
      toast.error('Failed to update verification status. ' + (e.message || ''));
    } finally {
      setTogglingId(null);
    }
  };

  const filteredOwners = owners.filter(owner => {
    const isVerified = owner.verificationStatus === 'VERIFIED' || owner.status === 'VERIFIED';
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'VERIFIED' && isVerified) || 
      (statusFilter === 'PENDING' && !isVerified);

    const searchLower = searchQuery.toLowerCase();
    const fullName = `${owner.name || ''} ${owner.firstName || ''} ${owner.lastName || ''}`.toLowerCase();
    const email = (owner.email || owner.user?.email || '').toLowerCase();
    const phone = (owner.phone || '').toLowerCase();
    const company = (owner.companyName || '').toLowerCase();

    const matchesSearch = 
      fullName.includes(searchLower) || 
      email.includes(searchLower) || 
      phone.includes(searchLower) || 
      company.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
            Super Admin
          </p>
          <h1 className="font-heading text-3xl font-bold">Hostel Owners</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage owner verifications and status manually since KYC is not implemented yet.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search owners by name, email, phone, or company..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 w-full bg-hosteloom-surface border border-hosteloom-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent/50 focus:ring-1 focus:ring-hosteloom-accent/50 transition-all font-body"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-48 bg-hosteloom-surface border border-hosteloom-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-hosteloom-accent/50 focus:ring-1 focus:ring-hosteloom-accent/50 transition-all font-body appearance-none cursor-pointer"
        >
          <option value="ALL">All Owners</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Unverified (Pending)</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : owners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-hosteloom-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <FiMonitor className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No owners found</p>
            <p className="text-hosteloom-muted text-sm mt-1">
              There are no registered hostel owners yet.
            </p>
          </div>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-hosteloom-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <FiMonitor className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No matches found</p>
            <p className="text-hosteloom-muted text-sm mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredOwners.map(owner => {
              const isVerified = owner.verificationStatus === 'VERIFIED' || owner.status === 'VERIFIED';
              const isToggling = togglingId === owner.id;

              return (
                <motion.div
                  key={owner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 flex flex-col gap-5 hover:border-hosteloom-accent/40 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-white text-lg">
                        {owner.name || `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Unnamed Owner'}
                      </h3>
                      <p className="text-sm text-hosteloom-muted font-body mt-0.5 truncate">
                        {owner.email || owner.user?.email || 'No email provided'}
                      </p>
                      {owner.companyName && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-lg border border-hosteloom-border text-[10px] font-heading font-medium text-hosteloom-muted bg-hosteloom-surface-light">
                          {owner.companyName}
                        </span>
                      )}
                    </div>
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-heading font-bold uppercase tracking-widest shrink-0 ${
                        isVerified
                          ? 'bg-green-400/10 text-green-400 border-green-400/20'
                          : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                      }`}
                    >
                      {isVerified ? (
                        <FiCheckCircle className="w-3 h-3" />
                      ) : (
                        <FiXCircle className="w-3 h-3" />
                      )}
                      {isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="text-sm font-body text-hosteloom-muted space-y-1">
                    <p>Phone: {owner.phone || 'N/A'}</p>
                    <p>Address: <span className="truncate">{owner.address || 'N/A'}</span></p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-hosteloom-border">
                    <button
                      onClick={() => toggleVerification(owner)}
                      disabled={isToggling}
                      className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                        isVerified
                          ? 'bg-transparent text-hosteloom-muted border border-hosteloom-border hover:text-white hover:bg-hosteloom-surface-light'
                          : 'bg-hosteloom-accent text-white hover:bg-hosteloom-accent/80'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isToggling ? (
                        'Processing...'
                      ) : isVerified ? (
                        'Mark as Unverified'
                      ) : (
                        'Verify Owner Now'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
