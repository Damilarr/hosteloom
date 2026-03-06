"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [role, setRole] = useState<UserRole>('STUDENT');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email: formData.email, password: formData.password, role });
    const { isAuthenticated, user, error: authError } = useStore.getState();
    if (authError) {
      toast.error(authError);
    } else if (isAuthenticated && user) {
      toast.success('Account created! Welcome to Hosteloom 🎉');
      router.push(user.role === 'HOSTEL_ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  };

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="mb-8 text-left">
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Create your account</h2>
        <p className="text-hosteloom-muted font-body text-sm">Sign up to get started with Hosteloom.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Role Selector */}
        <div className="flex bg-hosteloom-surface-light rounded-xl p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative mb-2">
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


        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <span className="font-heading font-bold text-lg select-none">H</span>
            </div>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="Full name"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiLock className="w-5 h-5" />
            </div>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-4 mt-8 bg-white text-black font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="mt-8 text-center text-sm font-body text-hosteloom-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-heading text-white border-b border-hosteloom-accent pb-[2px] hover:text-hosteloom-accent transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
