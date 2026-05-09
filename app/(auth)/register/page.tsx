"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiUser, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@/components/ui/Loader';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuthStore, useStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [role, setRole] = useState<UserRole>('STUDENT');
  const [formData, setFormData] = useState({
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
      if (user.role === 'HOSTEL_OWNER') {
        router.push('/owner/dashboard');
      } else if (user.role === 'HOSTEL_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
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
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 relative z-10 ${role === 'STUDENT' ? 'text-hosteloom-heading' : 'text-hosteloom-muted hover:text-hosteloom-heading'}`}>
            <FiUser className={`w-4 h-4 ${role === 'STUDENT' ? 'text-hosteloom-accent' : ''}`} />
            Student
          </button>
          <button type="button" onClick={() => setRole('HOSTEL_OWNER')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 relative z-10 ${role === 'HOSTEL_OWNER' ? 'text-hosteloom-heading' : 'text-hosteloom-muted hover:text-hosteloom-heading'}`}>
            <FiShield className={`w-4 h-4 ${role === 'HOSTEL_OWNER' ? 'text-hosteloom-accent' : ''}`} />
            Hostel Owner
          </button>
        </div>


        <div className="space-y-4">


          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-hosteloom-heading transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-hosteloom-heading placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required />
          </div>

          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-4 mt-8 bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isLoading && <Loader className="text-current" />}
          {isLoading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="mt-8 text-center text-sm font-body text-hosteloom-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-heading text-hosteloom-heading border-b border-hosteloom-accent pb-[2px] hover:text-hosteloom-accent transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
