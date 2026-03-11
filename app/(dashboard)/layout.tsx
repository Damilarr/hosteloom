"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MdDashboard, MdBedroomParent, MdPeople, MdPayment,
  MdBuild, MdBarChart, MdLogout, MdMenu, MdClose, MdPersonOutline,
  MdOutlinedFlag, MdDateRange
} from 'react-icons/md';
import { useAuthStore, useProfileStore, useStore } from '@/store';

const studentNav = [
  { href: '/dashboard', icon: MdDashboard, label: 'Overview' },
  { href: '/dashboard/profile', icon: MdPersonOutline, label: 'My Profile' },
  { href: '/dashboard/room', icon: MdBedroomParent, label: 'My Room' },
  { href: '/dashboard/payments', icon: MdPayment, label: 'Payments' },
  { href: '/dashboard/maintenance', icon: MdBuild, label: 'Maintenance' },
  { href: '/dashboard/complaints', icon: MdOutlinedFlag, label: 'Complaints' },
];

const ownerNav = [
  { href: '/owner/dashboard', icon: MdDashboard, label: 'Overview' },
  { href: '/owner/profile', icon: MdPersonOutline, label: 'My Profile' },
  { href: '/owner/dashboard/hostels', icon: MdBedroomParent, label: 'Hostels' }
];

const adminNav = [
  { href: '/admin/dashboard', icon: MdDashboard, label: 'Overview' },
  { href: '/admin/dashboard/sessions', icon: MdDateRange, label: 'Sessions' },
  { href: '/admin/dashboard/structure', icon: MdBuild, label: 'Hostel Structure' },
  { href: '/admin/dashboard/rooms', icon: MdBedroomParent, label: 'Rooms' },
  { href: '/admin/dashboard/students', icon: MdPeople, label: 'Students' },
  { href: '/admin/dashboard/complaints', icon: MdOutlinedFlag, label: 'Complaints' },
  { href: '/admin/dashboard/payments', icon: MdPayment, label: 'Payments' },
  { href: '/admin/dashboard/maintenance', icon: MdBuild, label: 'Maintenance' },
  { href: '/admin/dashboard/reports', icon: MdBarChart, label: 'Reports' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { 
    profile, adminProfile, ownerProfile, 
    fetchProfile, fetchAdminProfile, fetchOwnerProfile 
  } = useProfileStore();
  const hasHydrated = useStore((s) => s._hasHydrated);

  const [isCheckingProfile, setIsCheckingProfile] = React.useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = React.useState(false);

  const isAdmin = user?.role === 'HOSTEL_ADMIN';
  const isOwner = user?.role === 'HOSTEL_OWNER';
  
  const PROFILE_ROUTE = isAdmin ? '/admin/dashboard' : isOwner ? '/owner/profile' : '/dashboard/profile';
  const needsProfile = isAdmin ? !adminProfile : (isOwner ? !ownerProfile : !profile);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || hasCheckedProfile) return;

    if (!needsProfile) {
      setHasCheckedProfile(true);
      return;
    }

    const checkServer = async () => {
      setIsCheckingProfile(true);
      let profileStillMissing = true;
      
      if (isAdmin) {
        const ok = await fetchAdminProfile();
        profileStillMissing = !useStore.getState().adminProfile;
      } else if (isOwner) {
        await fetchOwnerProfile();
        profileStillMissing = !useStore.getState().ownerProfile;
      } else {
        await fetchProfile();
        profileStillMissing = !useStore.getState().profile;
      }
      
      setIsCheckingProfile(false);
      setHasCheckedProfile(true);
      
      if (profileStillMissing && !isAdmin) {
        router.replace(PROFILE_ROUTE);
      }
    };

    checkServer();
  }, [hasHydrated, isAuthenticated, needsProfile, hasCheckedProfile, isAdmin, isOwner, fetchAdminProfile, fetchOwnerProfile, fetchProfile, router, PROFILE_ROUTE]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && hasCheckedProfile && needsProfile && !isAdmin && pathname !== PROFILE_ROUTE) {
      router.replace(PROFILE_ROUTE);
    }
  }, [hasHydrated, isAuthenticated, hasCheckedProfile, needsProfile, isAdmin, pathname, router, PROFILE_ROUTE]);

  const displayName = isAdmin
    ? adminProfile ? `${adminProfile.firstName} ${adminProfile.lastName}`.trim() : user?.email ?? ''
    : isOwner ? user?.email ?? 'Hostel Owner' : profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.email ?? '';

  if (!hasHydrated || isCheckingProfile) {
    return (
      <div className="h-screen flex items-center justify-center bg-hosteloom-bg">
        <div className="w-6 h-6 rounded-full border-2 border-hosteloom-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const navItems = isAdmin ? adminNav : isOwner ? ownerNav : studentNav;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="h-screen overflow-hidden flex bg-hosteloom-bg text-hosteloom-text relative">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-hosteloom-accent opacity-[0.06] blur-[120px] pointer-events-none" />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-hosteloom-surface border-r border-hosteloom-border
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-hosteloom-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-hosteloom-text text-hosteloom-bg flex items-center justify-center font-heading font-bold text-lg group-hover:bg-hosteloom-accent group-hover:text-white transition-colors">
              H
            </div>
            <span className="font-heading font-medium tracking-widest uppercase text-xs opacity-80">Hosteloom</span>
          </Link>
          <button
            className="ml-auto lg:hidden text-hosteloom-muted hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
            isAdmin
              ? 'bg-hosteloom-accent/15 text-hosteloom-accent'
              : 'bg-hosteloom-secondary/15 text-hosteloom-secondary'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {isAdmin ? 'Hostel Admin' : isOwner ? 'Hostel Owner' : 'Student'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-heading font-medium transition-all duration-200 ${
                  active
                    ? 'bg-hosteloom-accent/15 text-white border border-hosteloom-accent/30'
                    : 'text-hosteloom-muted hover:bg-hosteloom-surface-light hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-hosteloom-accent' : ''}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6 pt-4 border-t border-hosteloom-border space-y-2">
          <div className="px-3 py-3 rounded-xl bg-hosteloom-surface-light">
            <p className="text-xs font-heading font-medium text-white truncate">{displayName}</p>
            <p className="text-[10px] text-hosteloom-muted mt-0.5 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-heading font-medium text-hosteloom-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <MdLogout className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-hosteloom-border bg-hosteloom-bg/80 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-hosteloom-muted hover:text-white transition-colors"
          >
            <MdMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-hosteloom-text text-hosteloom-bg flex items-center justify-center font-heading font-bold text-sm">
              H
            </div>
          </div>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
