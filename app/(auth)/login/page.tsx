"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    const { isAuthenticated, user, error: authError } = useStore.getState();
    if (authError) {
      toast.error(authError);
    } else if (isAuthenticated && user) {
      toast.success('Welcome back!');
      router.push(user.role === 'HOSTEL_ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  };

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="mb-10 text-left">
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-hosteloom-muted font-body text-sm">Sign in to your Hosteloom account to continue.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Role Selector */}
        <div className="flex bg-hosteloom-surface-light rounded-xl p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative">
          <AnimatePresence mode="wait">
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-hosteloom-surface rounded-lg shadow-md border border-hosteloom-border z-0"
              initial={false}
              animate={{ left: role === 'STUDENT' ? '4px' : 'calc(50%)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </AnimatePresence>

          <button type="button" onClick={() => setRole('STUDENT')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 relative z-10 ${role === 'STUDENT' ? 'text-white' : 'text-hosteloom-muted hover:text-white'}`}>
            <FiUser className={`w-4 h-4 ${role === 'STUDENT' ? 'text-hosteloom-accent' : ''}`} />
            Student
          </button>
          <button type="button" onClick={() => setRole('HOSTEL_ADMIN')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 relative z-10 ${role === 'HOSTEL_ADMIN' ? 'text-white' : 'text-hosteloom-muted hover:text-white'}`}>
            <FiShield className={`w-4 h-4 ${role === 'HOSTEL_ADMIN' ? 'text-hosteloom-accent' : ''}`} />
            Admin
          </button>
        </div>


        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiLock className="w-5 h-5" />
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-hosteloom-muted cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="rounded border-hosteloom-border bg-hosteloom-surface text-hosteloom-accent focus:ring-1 focus:ring-hosteloom-accent focus:ring-offset-0" />
            Keep me signed in
          </label>
          <a href="#" className="font-heading text-[10px] uppercase tracking-widest text-hosteloom-accent hover:text-white transition-colors">Forgot password?</a>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-4 mt-8 bg-white text-black font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="mt-8 text-center text-sm font-body text-hosteloom-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-heading text-white border-b border-hosteloom-accent pb-[2px] hover:text-hosteloom-accent transition-colors">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
