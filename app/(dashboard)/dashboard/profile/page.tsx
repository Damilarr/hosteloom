"use client";

import { useEffect } from 'react';
import { useAuthStore, useProfileStore } from '@/store';
import StudentProfileForm from '@/components/profile/StudentProfileForm';
import AdminProfileForm from '@/components/profile/AdminProfileForm';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, adminProfile, fetchProfile, fetchAdminProfile } = useProfileStore();

  const isAdmin = user?.role === 'HOSTEL_ADMIN';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminProfile();
    } else {
      fetchProfile();
    }
  }, [isAdmin, fetchProfile, fetchAdminProfile]);

  const displayName = isAdmin
    ? adminProfile ? `${adminProfile.firstName} ${adminProfile.lastName}`.trim() : null
    : profile     ? `${profile.firstName} ${profile.lastName}`.trim()            : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
          {isAdmin ? 'Admin Account' : 'Account'}
        </p>
        <h1 className="font-heading text-3xl font-bold">My Profile</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">
          {displayName ?? user?.email}
        </p>
      </div>

      {/* Incomplete banner */}
      {!isAdmin && !profile && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-sm font-heading font-semibold text-yellow-300">Profile incomplete</p>
            <p className="text-xs text-hosteloom-muted mt-0.5">
              Complete your profile to apply for room allocation.
            </p>
          </div>
        </div>
      )}

      {isAdmin && !adminProfile && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-sm font-heading font-semibold text-yellow-300">Profile incomplete</p>
            <p className="text-xs text-hosteloom-muted mt-0.5">
              Complete your hostel admin profile to access the dashboard.
            </p>
          </div>
        </div>
      )}

      {isAdmin ? <AdminProfileForm /> : <StudentProfileForm />}

    </div>
  );
}
