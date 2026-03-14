"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiBriefcase, FiSave, FiMail } from 'react-icons/fi';
import { toast } from 'sonner';
import { useProfileStore } from '@/store';
import type { OwnerProfilePayload } from '@/types';
import { inputClass, labelClass, submitButtonClass } from './styles';
import { useRouter } from 'next/navigation';

const EMPTY: OwnerProfilePayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
};

export default function OwnerProfileForm() {
  const router = useRouter();
  const { ownerProfile, ownerProfileLoading, saveOwnerProfile } = useProfileStore();

  const [form, setForm] = useState<OwnerProfilePayload>(EMPTY);

  useEffect(() => {
    if (ownerProfile) {
      setForm({
        firstName:   ownerProfile.firstName   ?? '',
        lastName:    ownerProfile.lastName    ?? '',
        email:       ownerProfile.email       ?? '',
        phone:       ownerProfile.phone       ?? '',
        companyName: ownerProfile.companyName ?? '',
      });
    }
  }, [ownerProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = !ownerProfile || (
    form.firstName   !== (ownerProfile.firstName   ?? '') ||
    form.lastName    !== (ownerProfile.lastName    ?? '') ||
    form.email       !== (ownerProfile.email       ?? '') ||
    form.phone       !== (ownerProfile.phone       ?? '') ||
    form.companyName !== (ownerProfile.companyName ?? '')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveOwnerProfile(form);
    if (ok) {
      toast.success(ownerProfile ? 'Profile updated!' : 'Profile created!');
      if (!ownerProfile) {
        router.push('/owner/dashboard');
      }
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const isDisabled = ownerProfileLoading || !isDirty;

  return (
    <form onSubmit={handleSubmit} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 space-y-6">
      
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>First name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiUser className="w-4 h-4" />
            </div>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
              placeholder="e.g. John" className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Last name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiUser className="w-4 h-4" />
            </div>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
              placeholder="e.g. Doe" className={inputClass} required />
          </div>
        </div>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Email address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiMail className="w-4 h-4" />
            </div>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="e.g. john@example.com" className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Phone number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiPhone className="w-4 h-4" />
            </div>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="e.g. 08012345678" className={inputClass} required />
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className={labelClass}>Company Name <span className="text-sm text-hosteloom-muted font-normal">(Optional)</span></label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
            <FiBriefcase className="w-4 h-4" />
          </div>
          <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
            placeholder="e.g. ABC Corp" className={inputClass} />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button type="submit" disabled={isDisabled} className={submitButtonClass(isDisabled)}>
          <FiSave className="w-4 h-4" />
          {ownerProfileLoading ? 'Saving…' : ownerProfile ? 'Update Profile' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
