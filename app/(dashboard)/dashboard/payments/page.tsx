'use client';

import { useEffect, useState } from 'react';
import { useInvoicesStore, usePaymentsStore, useProfileStore, useAuthStore } from '@/store';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MdPayment, MdRefresh } from 'react-icons/md';
import { FiClock, FiCheckCircle, FiXCircle, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@/components/ui/Loader';

const statusColor: Record<string, string> = {
  PAID:    'bg-green-400/15 text-green-400 border-green-400/20',
  UNPAID:  'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
  OVERDUE: 'bg-red-400/15 text-red-400 border-red-400/20',
  SUCCESS: 'bg-green-400/15 text-green-400 border-green-400/20',
  PENDING: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
  FAILED:  'bg-red-400/15 text-red-400 border-red-400/20',
};

const statusIcon: Record<string, React.ReactNode> = {
  PAID:    <FiCheckCircle className="w-5 h-5 text-green-400" />,
  UNPAID:  <FiClock className="w-5 h-5 text-yellow-400" />,
  PENDING: <FiClock className="w-5 h-5 text-yellow-400" />,
  OVERDUE: <FiXCircle className="w-5 h-5 text-red-400" />,
};

export default function MyPaymentsPage() {
  const { myInvoices, invoicesLoading, fetchMyInvoices } = useInvoicesStore();
  const { paymentHistory, paymentsLoading, fetchPaymentHistory, initializePayment } = usePaymentsStore();
  const { profile } = useProfileStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'invoices' | 'history'>('invoices');
  const [initializing, setInitializing] = useState<string | null>(null);

  useEffect(() => {
    fetchMyInvoices();
    fetchPaymentHistory();
  }, [fetchMyInvoices, fetchPaymentHistory]);

  const handlePay = async (invoiceId: string, amount: string) => {
    if (!profile?.userId) {
      toast.error('Profile not fully loaded');
      return;
    }
    setInitializing(invoiceId);
    try {
      const response = await initializePayment({
        invoiceId,
        amount: parseInt(amount, 10),
        email: user?.email || '', 
        callback_url: `${window.location.origin}/dashboard/payments/verify`,
      });

      if (response && response.authorization_url) {
        window.location.href = response.authorization_url;
      } else {
        toast.error('Failed to parse authorization URL from payment provider');
      }
    } catch (e) {
      toast.error('Failed to initialize payment');
    } finally {
      setInitializing(null);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseInt(amount, 10));
  };

  const tabs = [
    { key: 'invoices' as const, label: 'My Invoices', count: myInvoices.length },
    { key: 'history' as const, label: 'Payment History', count: paymentHistory.length },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Student</p>
          <h1 className="font-heading text-3xl font-bold">Payments</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage your invoices and track payment history.
          </p>
        </div>
        <button
          onClick={() => { fetchMyInvoices(); fetchPaymentHistory(); }}
          disabled={invoicesLoading || paymentsLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
        >
          <MdRefresh className={`w-4 h-4 ${invoicesLoading || paymentsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.key
                ? 'bg-hosteloom-accent text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-white'
            }`}
          >
            {tab.label} <span className="ml-1 opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ─── INVOICES TAB ─────────────────────────────────────────────── */}
      {activeTab === 'invoices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

          {/* Loading skeleton */}
          {invoicesLoading && myInvoices.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!invoicesLoading && myInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
                <MdPayment className="w-6 h-6 text-hosteloom-muted" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white">No invoices yet</p>
                <p className="text-hosteloom-muted text-sm mt-1">Invoices will appear here once you&apos;re allocated a room.</p>
              </div>
            </div>
          )}

          {/* Invoice cards */}
          {myInvoices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence initial={false}>
                {myInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`bg-hosteloom-surface border rounded-2xl p-5 flex flex-col gap-4 transition-all ${
                      invoice.status === 'PAID'
                        ? 'border-green-400/20'
                        : invoice.status === 'OVERDUE'
                        ? 'border-red-400/20'
                        : 'border-hosteloom-border hover:border-hosteloom-accent/40'
                    }`}
                  >
                    {/* Status + Amount */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          invoice.status === 'PAID' ? 'bg-green-400/10' :
                          invoice.status === 'OVERDUE' ? 'bg-red-400/10' : 'bg-yellow-400/10'
                        }`}>
                          {statusIcon[invoice.status] || <FiClock className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[9px] font-heading font-bold uppercase tracking-widest ${statusColor[invoice.status] || ''}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="font-heading font-bold text-2xl text-white">{formatCurrency(invoice.amount)}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 flex-1">
                      {invoice.description && (
                        <p className="text-sm font-body text-white">{invoice.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-hosteloom-muted">
                        <span>Due: {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</span>
                        {invoice.allocation?.room && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-hosteloom-border" />
                            <span>Room {invoice.allocation.room.roomNumber}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Pay button */}
                    {invoice.status !== 'PAID' && (
                      <button
                        onClick={() => handlePay(invoice.id, invoice.amount)}
                        disabled={initializing === invoice.id}
                        className="w-full py-3 bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-hosteloom-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {initializing === invoice.id ? (
                          <><Loader className="text-current" size={14} /> Processing…</>
                        ) : (
                          <><FiCreditCard className="w-4 h-4" /> Pay Now</>
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── HISTORY TAB ──────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

          {/* Loading skeleton */}
          {paymentsLoading && paymentHistory.length === 0 && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!paymentsLoading && paymentHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-hosteloom-muted" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white">No payment records</p>
                <p className="text-hosteloom-muted text-sm mt-1">Your payment history will appear here after an invoice is paid.</p>
              </div>
            </div>
          )}

          {/* Payment history list */}
          {paymentHistory.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {paymentHistory.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 hover:border-hosteloom-accent/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          payment.status === 'SUCCESS' ? 'bg-green-400/10' :
                          payment.status === 'PENDING' ? 'bg-yellow-400/10' : 'bg-red-400/10'
                        }`}>
                          {payment.status === 'SUCCESS' ? <FiCheckCircle className="w-5 h-5 text-green-400" /> :
                           payment.status === 'PENDING' ? <FiClock className="w-5 h-5 text-yellow-400" /> :
                           <FiXCircle className="w-5 h-5 text-red-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-white truncate">{payment.reference}</p>
                          <p className="text-xs text-hosteloom-muted mt-0.5">
                            {format(new Date(payment.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="text-center min-w-[80px]">
                          <p className="text-[9px] font-heading uppercase tracking-widest text-hosteloom-muted mb-0.5">Amount</p>
                          <p className="font-heading font-bold text-white text-xs">{formatCurrency(payment.amount)}</p>
                        </div>

                        <div className="text-center min-w-[60px]">
                          <p className="text-[9px] font-heading uppercase tracking-widest text-hosteloom-muted mb-0.5">Channel</p>
                          <p className="font-heading font-medium text-hosteloom-muted text-xs uppercase">
                            {payment.receiptData?.channel || 'N/A'}
                          </p>
                        </div>

                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-heading font-bold uppercase tracking-widest ${statusColor[payment.status] || ''}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
