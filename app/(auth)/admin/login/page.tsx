"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { Loader } from '@/components/ui/Loader';
import { useAuthStore, useStore } from '@/store';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    const { isAuthenticated, user, error: authError } = useStore.getState();
    
    if (authError) {
      toast.error(authError);
    } else if (isAuthenticated && user) {
      if (user.role !== 'HOSTEL_ADMIN') {
        toast.error('This portal is strictly for Hostel Admins.');
        return;
      }
      
      toast.success('Welcome back, Admin!');
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hosteloom-accent/15 text-hosteloom-accent text-[10px] font-heading font-bold uppercase tracking-widest mb-4">
          <FiShield className="w-3 h-3" />
          Admin Portal
        </div>
        <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
        <p className="text-hosteloom-muted font-body text-sm">Please sign in with your admin credentials.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required 
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiLock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border border-hosteloom-border rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body"
              required 
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-hosteloom-muted hover:text-white transition-colors flex items-center justify-center p-1"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-4 mt-8 bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest rounded-xl hover:bg-hosteloom-accent/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hosteloom-accent focus:ring-offset-2 focus:ring-offset-hosteloom-bg border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="text-current" />}
          {isLoading ? 'Signing in…' : 'Sign In to Portal'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm font-body text-hosteloom-muted">
            Are you a student or owner?{" "}
            <a href="/login" className="text-white hover:text-hosteloom-accent transition-colors font-semibold">General Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}
