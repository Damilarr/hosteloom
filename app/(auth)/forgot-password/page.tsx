"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Loader } from '@/components/ui/Loader';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await forgotPassword({ email });
    if (success) {
      toast.success('Reset link sent to your email!');
      setIsSubmitted(true);
    } else {
      toast.error('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="mb-10 text-left">
        <Link href="/login" className="inline-flex items-center gap-2 text-hosteloom-accent hover:text-white transition-colors text-sm font-heading uppercase tracking-widest mb-6 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Forgot Password</h2>
        <p className="text-hosteloom-muted font-body text-sm">
          {isSubmitted 
            ? "Check your inbox for further instructions." 
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSubmitted ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-white text-black font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="text-current" />}
            {isLoading ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <div className="bg-hosteloom-surface/30 border border-hosteloom-accent/20 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-hosteloom-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-8 h-8 text-hosteloom-accent" />
          </div>
          <h3 className="text-white font-heading font-semibold mb-2">Check your email</h3>
          <p className="text-hosteloom-muted text-sm font-body mb-6">
            We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-hosteloom-accent hover:text-white transition-colors text-xs font-heading font-bold uppercase tracking-tighter"
          >
            Didn't receive it? Try again
          </button>
        </div>
      )}
    </div>
  );
}
