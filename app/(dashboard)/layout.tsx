"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MdDashboard, MdBedroomParent, MdPeople, MdPayment,
  MdBuild, MdBarChart, MdLogout, MdMenu, MdClose, MdPersonOutline,
  MdOutlinedFlag, MdDateRange, MdHelpOutline, MdAdminPanelSettings
} from 'react-icons/md';
import { useAuthStore, useProfileStore, useStore } from '@/store';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';
import TourProvider, { useTour, resetTourForRole } from '@/components/ui/TourProvider';
import GuidedTour from '@/components/ui/GuidedTour';
import Tooltip from '@/components/ui/Tooltip';

const studentNav = [
  { href: '/dashboard', icon: MdDashboard, label: 'Overview', tourId: 'nav-overview' },
  { href: '/dashboard/profile', icon: MdPersonOutline, label: 'My Profile', tourId: 'nav-my-profile' },
  { href: '/dashboard/room', icon: MdBedroomParent, label: 'My Room', tourId: 'nav-my-room' },
  { href: '/dashboard/select-room', icon: MdBedroomParent, label: 'Select Room', tourId: 'nav-select-room' },
  { href: '/dashboard/payments', icon: MdPayment, label: 'Payments', tourId: 'nav-payments' },
  { href: '/dashboard/complaints', icon: MdOutlinedFlag, label: 'Complaints', tourId: 'nav-complaints' },
];

const ownerNav = [
  { href: '/owner/dashboard', icon: MdDashboard, label: 'Overview', tourId: 'nav-overview' },
  { href: '/owner/profile', icon: MdPersonOutline, label: 'My Profile', tourId: 'nav-my-profile' },
  { href: '/owner/dashboard/hostels', icon: MdBedroomParent, label: 'Hostels', tourId: 'nav-hostels' },
  { href: '/owner/dashboard/admins', icon: MdAdminPanelSettings, label: 'Admins', tourId: 'nav-admins' }
];

const adminNav = [
  { href: '/admin/dashboard', icon: MdDashboard, label: 'Overview', tourId: 'nav-overview' },
  { href: '/admin/dashboard/sessions', icon: MdDateRange, label: 'Sessions', tourId: 'nav-sessions' },
  { href: '/admin/dashboard/structure', icon: MdBuild, label: 'Hostel Structure', tourId: 'nav-hostel-structure' },
  { href: '/admin/dashboard/rooms', icon: MdBedroomParent, label: 'Rooms', tourId: 'nav-rooms' },
  { href: '/admin/dashboard/applications', icon: MdOutlinedFlag, label: 'Applications', tourId: 'nav-applications' },
  { href: '/admin/dashboard/students', icon: MdPeople, label: 'Students', tourId: 'nav-students' },
  { href: '/admin/dashboard/complaints', icon: MdOutlinedFlag, label: 'Complaints', tourId: 'nav-complaints' },
  { href: '/admin/dashboard/payments', icon: MdPayment, label: 'Payments', tourId: 'nav-payments' },
  { href: '/admin/dashboard/reports', icon: MdBarChart, label: 'Reports', tourId: 'nav-reports' },
];

const superAdminNav = [
  { href: '/super-admin/dashboard', icon: MdDashboard, label: 'Overview', tourId: 'nav-sa-overview' },
  { href: '/super-admin/dashboard/owners', icon: MdAdminPanelSettings, label: 'Hostel Owners', tourId: 'nav-sa-owners' },
  { href: '/super-admin/dashboard/students', icon: MdPeople, label: 'Students', tourId: 'nav-sa-students' },
  { href: '/super-admin/dashboard/announcements', icon: MdOutlinedFlag, label: 'Announcements', tourId: 'nav-sa-announcements' }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useNotificationsSocket();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
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

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'HOSTEL_ADMIN';
  const isOwner = user?.role === 'HOSTEL_OWNER';
  
  const PROFILE_ROUTE = isSuperAdmin ? '/super-admin/dashboard/owners' : isAdmin ? '/admin/dashboard' : isOwner ? '/owner/profile' : '/dashboard/profile';
  const needsProfile = isSuperAdmin ? false : isAdmin ? !adminProfile : (isOwner ? !ownerProfile : !profile);

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
      
      if (profileStillMissing && !isAdmin && !isSuperAdmin) {
        router.replace(PROFILE_ROUTE);
      }
    };

    checkServer();
  }, [hasHydrated, isAuthenticated, needsProfile, hasCheckedProfile, isAdmin, isOwner, fetchAdminProfile, fetchOwnerProfile, fetchProfile, router, PROFILE_ROUTE]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && hasCheckedProfile && needsProfile && (!isAdmin && !isSuperAdmin) && pathname !== PROFILE_ROUTE) {
      router.replace(PROFILE_ROUTE);
    }
  }, [hasHydrated, isAuthenticated, hasCheckedProfile, needsProfile, isAdmin, isSuperAdmin, pathname, router, PROFILE_ROUTE]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const displayName = isSuperAdmin
    ? 'Super Admin'
    : isAdmin
    ? adminProfile ? `${adminProfile.firstName} ${adminProfile.lastName}`.trim() : user?.email ?? ''
    : isOwner ? user?.email ?? 'Hostel Owner' : profile ? `${profile.firstName} ${profile.lastName}`.trim() : user?.email ?? '';

  const studentHistory = useStore((s) => s.studentHistory);
  const myInvoices = useStore((s) => s.myInvoices);
  const hasRoomOrPendingPayment = studentHistory.some((h) => h.status === 'ACTIVE' || (h.status as string) === 'PENDING_PAYMENT')
    || myInvoices.some((i) => i.status !== 'PAID');

  if (!hasHydrated || isCheckingProfile) {
    return (
      <div className="h-screen flex items-center justify-center bg-hosteloom-bg">
        <div className="w-6 h-6 rounded-full border-2 border-hosteloom-accent border-t-transparent animate-spin" />
      </div>
    );
  }


  const navItems = isSuperAdmin
    ? superAdminNav
    : isAdmin 
    ? adminNav 
    : isOwner 
    ? ownerNav 
    : studentNav.filter(item => {
        // Hide "Select Room" if student already has a room or pending payment
        if (item.href === '/dashboard/select-room' && hasRoomOrPendingPayment) return false;
        return true;
      });

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <TourProvider role={user?.role} profileReady={!needsProfile}>
    <DashboardInner>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-hosteloom-accent/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-hosteloom-secondary/10 blur-[130px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Interactive Cursor Spotlight */}
      <div 
        className="fixed top-0 left-0 w-[800px] h-[800px] pointer-events-none z-0 mix-blend-screen transition-transform duration-[50ms] ease-out hidden lg:block"
        style={{
          background: `radial-gradient(circle closest-side, rgba(168, 85, 247, 0.08), transparent)`,
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`
        }}
      />

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
            <img src="/hosteloom-logo.png" alt="Hosteloom Logo" className="h-8 w-auto" />
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
            isAdmin || isSuperAdmin
              ? 'bg-hosteloom-accent/15 text-hosteloom-accent'
              : 'bg-hosteloom-secondary/15 text-hosteloom-secondary'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Hostel Admin' : isOwner ? 'Hostel Owner' : 'Student'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label, tourId }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                data-tour-id={tourId}
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
            <img src="/hosteloom-logo.png" alt="Hosteloom Logo" className="h-7 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <RestartTourButton role={user?.role} />
            <NotificationsDropdown />
          </div>
        </header>

        {/* Top bar desktop */}
        <header className="hidden lg:flex sticky top-0 z-20 h-16 items-center justify-end px-8 border-b border-hosteloom-border bg-hosteloom-bg/80 backdrop-blur-md gap-2">
          <RestartTourButton role={user?.role} />
          <NotificationsDropdown />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <GuidedTour />
    </DashboardInner>
    </TourProvider>
  );
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex bg-[#06040A] bg-gradient-to-br from-[#06040A] via-[#0B0914] to-[#040306] text-hosteloom-text relative selection:bg-hosteloom-accent/30 selection:text-white">
      {children}
    </div>
  );
}

function RestartTourButton({ role }: { role?: string }) {
  const { isActive, startForRole } = useTour();

  if (isActive) return null;

  return (
    <Tooltip content="Take a tour" position="bottom">
      <button
        onClick={() => {
          resetTourForRole(role);
          startForRole(role);
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-hosteloom-muted hover:text-white hover:bg-white/5 transition-all"
        aria-label="Start guided tour"
      >
        <MdHelpOutline className="w-5 h-5" />
      </button>
    </Tooltip>
  );
}
