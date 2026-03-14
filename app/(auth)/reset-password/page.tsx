"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { Loader } from '@/components/ui/Loader';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuthStore();
  
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    const success = await resetPassword({ password, token });
    if (success) {
      toast.success('Password updated successfully!');
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      toast.error('Failed to reset password. Token may be expired.');
    }
  };

  if (!token) {
    return (
      <div className="text-center py-10">
        <h2 className="text-white font-heading text-xl mb-4">Invalid or missing token</h2>
        <Link href="/forgot-password" title="forgot password" className="text-hosteloom-accent hover:underline">Request a new reset link</Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="mb-10 text-left">
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Reset Password</h2>
        <p className="text-hosteloom-muted font-body text-sm">Choose a new password for your account.</p>
      </div>

      {!isSuccess ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-8 bg-white text-black font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="text-current" />}
            {isLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      ) : (
        <div className="bg-hosteloom-surface/30 border border-success/20 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-white font-heading font-semibold mb-2">Success!</h3>
          <p className="text-hosteloom-muted text-sm font-body mb-6">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <Link href="/login" className="text-hosteloom-accent hover:text-white transition-colors text-xs font-heading font-bold uppercase tracking-tighter">
            Go to login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader size={32} /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
