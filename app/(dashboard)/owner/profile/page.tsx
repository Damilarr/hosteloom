"use client";

import { useEffect } from 'react';
import { useAuthStore, useProfileStore } from '@/store';
import OwnerProfileForm from '@/components/profile/OwnerProfileForm';

export default function OwnerProfilePage() {
  const { user } = useAuthStore();
  const { ownerProfile, fetchOwnerProfile } = useProfileStore();

  useEffect(() => {
    fetchOwnerProfile();
  }, [fetchOwnerProfile]);

  const displayName = ownerProfile
    ? `${ownerProfile.firstName} ${ownerProfile.lastName}`.trim()
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">
          Owner Account
        </p>
        <h1 className="font-heading text-3xl font-bold">My Profile</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">
          {displayName ?? user?.email}
        </p>
      </div>

      {/* Incomplete banner */}
      {!ownerProfile && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-sm font-heading font-semibold text-yellow-300">Profile incomplete</p>
            <p className="text-xs text-hosteloom-muted mt-0.5">
              Complete your owner profile to access the dashboard.
            </p>
          </div>
        </div>
      )}

      <OwnerProfileForm />
    </div>
  );
}
