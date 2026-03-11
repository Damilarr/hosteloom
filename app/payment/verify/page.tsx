'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePaymentsStore } from '@/store';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

function VerifyPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const { verifyPayment } = usePaymentsStore();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState<string>('Verifying your payment...');
  
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference provided.');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const performVerification = async () => {
      try {
        const response = await verifyPayment(reference);
        if (response && response.status === 'success' || response?.data?.status === 'success') {
          setStatus('success');
          setMessage('Payment verified successfully!');
        } else {
          setStatus('failed');
          setMessage(response?.message || 'Payment verification failed or returned pending.');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('An error occurred during verification.');
      }
    };

    performVerification();
  }, [reference, verifyPayment]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-hosteloom-bg px-4 py-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-hosteloom-surface p-8 rounded-2xl border border-hosteloom-border max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          {status === 'verifying' && (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <FiLoader className="w-16 h-16 text-hosteloom-accent" />
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <FiCheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
          )}
          {status === 'failed' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <FiXCircle className="w-16 h-16 text-red-500" />
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold tracking-tight text-white">
            {status === 'verifying' ? 'Processing...' : status === 'success' ? 'Payment Successful' : 'Verification Failed'}
          </h2>
          <p className="text-hosteloom-muted font-body text-sm">{message}</p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => router.push('/dashboard/payments')}
            className={`w-full inline-flex items-center justify-center rounded-xl text-xs font-heading font-bold tracking-widest uppercase transition-colors h-12 px-4 py-2 ${
              status === 'success' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20' : 'bg-hosteloom-accent text-white hover:bg-hosteloom-accent/80'
            }`}
          >
            {status === 'verifying' ? 'Return to Dashboard' : 'View My Payments'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-hosteloom-bg px-4">
        <FiLoader className="w-12 h-12 text-hosteloom-accent animate-spin" />
      </div>
    }>
      <VerifyPaymentContent />
    </Suspense>
  );
}
