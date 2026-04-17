"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiBriefcase, FiSave, FiMail, FiMapPin, FiCreditCard, FiHash } from 'react-icons/fi';
import { toast } from 'sonner';
import { useProfileStore } from '@/store';
import type { OwnerProfilePayload } from '@/types';
import { inputClass, labelClass, submitButtonClass } from './styles';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Bank {
  name: string;
  slug: string;
  code: string;
  ussd: string;
  logo: string;
}

const EMPTY: OwnerProfilePayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  bankCode: '',
  bankAccountNo: '',
  bankAccountName: '',
};

export default function OwnerProfileForm() {
  const router = useRouter();
  const { ownerProfile, ownerProfileLoading, saveOwnerProfile } = useProfileStore();

  const [form, setForm] = useState<OwnerProfilePayload>(EMPTY);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    api.get<{message: string; data: Bank[]}>('/payments/banks')
      .then(res => setBanks(res.data))
      .catch(err => console.error('Failed to fetch banks', err));
  }, []);

  useEffect(() => {
    if (ownerProfile) {
      setForm({
        firstName:   ownerProfile.firstName   ?? '',
        lastName:    ownerProfile.lastName    ?? '',
        email:       ownerProfile.email       ?? '',
        phone:       ownerProfile.phone       ?? '',
        address:     ownerProfile.address     ?? '',
        companyName: ownerProfile.companyName ?? '',
        bankCode:    ownerProfile.bankCode    ?? '',
        bankAccountNo: ownerProfile.bankAccountNo ?? '',
        bankAccountName: ownerProfile.bankAccountName ?? '',
      });
    }
  }, [ownerProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = !ownerProfile || (
    form.firstName   !== (ownerProfile.firstName   ?? '') ||
    form.lastName    !== (ownerProfile.lastName    ?? '') ||
    form.email       !== (ownerProfile.email       ?? '') ||
    form.phone       !== (ownerProfile.phone       ?? '') ||
    form.address     !== (ownerProfile.address     ?? '') ||
    form.companyName !== (ownerProfile.companyName ?? '') ||
    form.bankCode    !== (ownerProfile.bankCode    ?? '') ||
    form.bankAccountNo !== (ownerProfile.bankAccountNo ?? '') ||
    form.bankAccountName !== (ownerProfile.bankAccountName ?? '')
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

      {/* Address */}
      <div>
        <label className={labelClass}>Home/Contact Address</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
            <FiMapPin className="w-4 h-4" />
          </div>
          <input type="text" name="address" value={form.address} onChange={handleChange}
            placeholder="e.g. 123 Business St, Lagos" className={inputClass} required />
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

      {/* Banking Details */}
      <div className="pt-4 border-t border-hosteloom-border space-y-6">
        <h3 className="font-heading font-semibold text-lg text-white">Banking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Account Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
                <FiHash className="w-4 h-4" />
              </div>
              <input type="text" name="bankAccountNo" value={form.bankAccountNo} onChange={handleChange}
                placeholder="e.g. 0123456789" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bank</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
                <FiCreditCard className="w-4 h-4" />
              </div>
              <select name="bankCode" value={form.bankCode} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer w-full bg-hosteloom-surface`}>
                <option value="" disabled className="bg-hosteloom-surface text-hosteloom-muted">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code} className="bg-hosteloom-surface text-white">
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass}>Account Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted group-focus-within:text-white transition-colors">
              <FiUser className="w-4 h-4" />
            </div>
            <input type="text" name="bankAccountName" value={form.bankAccountName} onChange={handleChange}
              placeholder="e.g. John Doe" className={inputClass} />
          </div>
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
