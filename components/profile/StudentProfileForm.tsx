"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiBook, FiHash, FiLayers, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { useProfileStore } from '@/store';
import type { ProfilePayload } from '@/types';
import { inputClass, labelClass, submitButtonClass } from './styles';
import StatusBanner from './StatusBanner';
import { useRouter } from 'next/navigation';

const ACADEMIC_LEVELS = ['100', '200', '300', '400', '500', '600', 'Postgraduate'];

const EMPTY: ProfilePayload = {
  firstName: '',
  lastName: '',
  phone: '',
  school: '',
  matricNo: '',
  academicLevel: '100',
};

export default function StudentProfileForm() {
  const router = useRouter();
  const { profile, profileLoading, saveProfile } = useProfileStore();

  const [form, setForm] = useState<ProfilePayload>(EMPTY);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName:     profile.firstName     ?? '',
        lastName:      profile.lastName      ?? '',
        phone:         profile.phone         ?? '',
        school:        profile.school        ?? '',
        matricNo:      profile.matricNo      ?? '',
        academicLevel: profile.academicLevel ?? '100',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = !profile || (
    form.firstName     !== (profile.firstName     ?? '') ||
    form.lastName      !== (profile.lastName      ?? '') ||
    form.phone         !== (profile.phone         ?? '') ||
    form.school        !== (profile.school        ?? '') ||
    form.matricNo      !== (profile.matricNo      ?? '') ||
    form.academicLevel !== (profile.academicLevel ?? '100')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveProfile(form);
    if (ok) toast.success(profile ? 'Profile updated!' : 'Profile created!');
    else toast.error('Something went wrong. Please try again.');
    profile? null: router.push('/dashboard');
  };

  const isDisabled = profileLoading || !isDirty;

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

      {/* School */}
      <div>
        <label className={labelClass}>Institution / School</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
            <FiBook className="w-4 h-4" />
          </div>
          <input type="text" name="school" value={form.school} onChange={handleChange}
            placeholder="e.g. University of Lagos" className={inputClass} required />
        </div>
      </div>

      {/* Matric & Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Matric number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiHash className="w-4 h-4" />
            </div>
            <input type="text" name="matricNo" value={form.matricNo} onChange={handleChange}
              placeholder="e.g. 190404001" className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Academic level</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiLayers className="w-4 h-4" />
            </div>
            <select name="academicLevel" value={form.academicLevel} onChange={handleChange}
              className={`${inputClass} appearance-none`} required>
              {ACADEMIC_LEVELS.map((l) => (
                <option key={l} value={l} className="bg-hosteloom-surface text-white">
                  {l === 'Postgraduate' ? 'Postgraduate' : `${l} Level`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status banner only shows once profile exists */}
      <StatusBanner profile={profile} />

      {/* Submit */}
      <div className="pt-2">
        <button type="submit" disabled={isDisabled} className={submitButtonClass(isDisabled)}>
          <FiSave className="w-4 h-4" />
          {profileLoading ? 'Saving…' : profile ? 'Update Profile' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
