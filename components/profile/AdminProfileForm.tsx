"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiHome, FiBriefcase, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { useProfileStore } from '@/store';
import type { AdminProfilePayload } from '@/types';
import { inputClass, labelClass, submitButtonClass } from './styles';

const EMPTY: AdminProfilePayload = {
  firstName: '',
  lastName: '',
  phone: '',
  hostel: '',
  position: '',
};

export default function AdminProfileForm() {
  const { adminProfile, adminProfileLoading, saveAdminProfile } = useProfileStore();

  const [form, setForm] = useState<AdminProfilePayload>(EMPTY);

  useEffect(() => {
    if (adminProfile) {
      setForm({
        firstName: adminProfile.firstName ?? '',
        lastName:  adminProfile.lastName  ?? '',
        phone:     adminProfile.phone     ?? '',
        hostel:    adminProfile.hostel    ?? '',
        position:  adminProfile.position  ?? '',
      });
    }
  }, [adminProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = !adminProfile || (
    form.firstName !== (adminProfile.firstName ?? '') ||
    form.lastName  !== (adminProfile.lastName  ?? '') ||
    form.phone     !== (adminProfile.phone     ?? '') ||
    form.hostel    !== (adminProfile.hostel    ?? '') ||
    form.position  !== (adminProfile.position  ?? '')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveAdminProfile(form);
    if (ok) toast.success(adminProfile ? 'Profile updated!' : 'Profile created!');
    else toast.error('Something went wrong. Please try again.');
  };

  const isDisabled = adminProfileLoading || !isDirty;

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
              placeholder="e.g. Favour" className={inputClass} required />
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

      {/* Phone */}
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

      {/* Hostel */}
      <div>
        <label className={labelClass}>Hostel name</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
            <FiHome className="w-4 h-4" />
          </div>
          <input type="text" name="hostel" value={form.hostel} onChange={handleChange}
            placeholder="e.g. Arafims Hostel" className={inputClass} required />
        </div>
      </div>

      {/* Position */}
      <div>
        <label className={labelClass}>Position / Role</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
            <FiBriefcase className="w-4 h-4" />
          </div>
          <input type="text" name="position" value={form.position} onChange={handleChange}
            placeholder="e.g. Manager, Security, Warden" className={inputClass} required />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button type="submit" disabled={isDisabled} className={submitButtonClass(isDisabled)}>
          <FiSave className="w-4 h-4" />
          {adminProfileLoading ? 'Saving…' : adminProfile ? 'Update Profile' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
