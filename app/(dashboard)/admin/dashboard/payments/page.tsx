'use client';

import { useEffect, useState } from 'react';
import { useInvoicesStore } from '@/store';
import { format } from 'date-fns';
import { MdPayment, MdSearch, MdRefresh } from 'react-icons/md';
import { FiDollarSign, FiClock, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_FILTERS = ['ALL', 'PAID', 'UNPAID', 'OVERDUE'] as const;

const statusColor: Record<string, string> = {
  PAID:    'bg-green-400/15 text-green-400 border-green-400/20',
  UNPAID:  'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
  PENDING: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
  OVERDUE: 'bg-red-400/15 text-red-400 border-red-400/20',
};

export default function AdminPaymentsPage() {
  const { invoices, invoicesLoading, fetchAllInvoices } = useInvoicesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchAllInvoices();
  }, [fetchAllInvoices]);

  const filteredInvoices = invoices.filter((invoice) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      invoice.student?.profile.firstName.toLowerCase().includes(q) ||
      invoice.student?.profile.lastName.toLowerCase().includes(q) ||
      invoice.student?.profile.matricNo.toLowerCase().includes(q) ||
      invoice.student?.email.toLowerCase().includes(q) ||
      invoice.allocation?.room.roomNumber.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'ALL' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseInt(amount, 10));
  };

  const totalCollected = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, invoice) => sum + parseInt(invoice.amount, 10), 0);

  const pendingCollection = invoices
    .filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE')
    .reduce((sum, invoice) => sum + parseInt(invoice.amount, 10), 0);

  const counts: Record<string, number> = {
    ALL:     invoices.length,
    PAID:    invoices.filter(i => i.status === 'PAID').length,
    UNPAID:  invoices.filter(i => i.status === 'UNPAID').length,
    OVERDUE: invoices.filter(i => i.status === 'OVERDUE').length,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Payments</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Monitor invoices, track collections and outstanding balances.
          </p>
        </div>
        <button
          onClick={() => fetchAllInvoices()}
          disabled={invoicesLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
        >
          <MdRefresh className={`w-4 h-4 ${invoicesLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Total Collected</p>
            <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
              <FiDollarSign className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-white">{formatCurrency(totalCollected.toString())}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Pending Collection</p>
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <FiClock className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-white">{formatCurrency(pendingCollection.toString())}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-hosteloom-muted">Total Invoices</p>
            <div className="w-8 h-8 rounded-lg bg-hosteloom-accent/10 flex items-center justify-center">
              <FiFileText className="w-4 h-4 text-hosteloom-accent" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-white">{invoices.length}</p>
        </motion.div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all ${
              filterStatus === s
                ? 'bg-hosteloom-accent text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-white'
            }`}
          >
            {s} <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted">
          <MdSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, matric no. or room…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm bg-hosteloom-surface border border-hosteloom-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
        />
      </div>

      {/* Loading */}
      {invoicesLoading && invoices.length === 0 && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!invoicesLoading && filteredInvoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <MdPayment className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No invoices found</p>
            <p className="text-hosteloom-muted text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        </div>
      )}

      {/* Invoice list */}
      {filteredInvoices.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 hover:border-hosteloom-accent/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Student info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent font-heading font-bold text-sm shrink-0">
                      {invoice.student?.profile.firstName?.[0]}{invoice.student?.profile.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-sm text-white truncate">
                        {invoice.student?.profile.firstName} {invoice.student?.profile.lastName}
                      </p>
                      <p className="text-xs text-hosteloom-muted truncate">
                        {invoice.student?.profile.matricNo} • {invoice.student?.email}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-6 flex-wrap text-sm">
                    <div className="text-center min-w-[60px]">
                      <p className="text-[9px] font-heading uppercase tracking-widest text-hosteloom-muted mb-0.5">Room</p>
                      <p className="font-heading font-bold text-white text-xs">
                        {invoice.allocation?.room.roomNumber || '—'}
                      </p>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <p className="text-[9px] font-heading uppercase tracking-widest text-hosteloom-muted mb-0.5">Amount</p>
                      <p className="font-heading font-bold text-white text-xs">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <p className="text-[9px] font-heading uppercase tracking-widest text-hosteloom-muted mb-0.5">Due</p>
                      <p className="font-heading font-medium text-hosteloom-muted text-xs">
                        {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                      </p>
                    </div>

                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-heading font-bold uppercase tracking-widest ${statusColor[invoice.status] || ''}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
