export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
}

export const studentTour: TourConfig = {
  id: 'student-tour',
  steps: [
    {
      id: 'student-overview',
      target: '[data-tour-id="student-stats"]',
      title: 'Your Dashboard',
      description: 'Get a quick snapshot of your room status, payments, and open complaints — all at a glance.',
      placement: 'bottom',
    },
    {
      id: 'student-hostel-search',
      target: '[data-tour-id="hostel-search"]',
      title: 'Find a Hostel',
      description: 'Search for available hostels by name or location and apply directly from here.',
      placement: 'bottom',
    },
    {
      id: 'student-room',
      target: '[data-tour-id="nav-my-room"]',
      title: 'My Room',
      description: 'Once allocated, view your room details, roommates, and hostel info here.',
      placement: 'right',
    },
    {
      id: 'student-payments',
      target: '[data-tour-id="nav-payments"]',
      title: 'Payments',
      description: 'View your invoices, make payments, and track your payment history.',
      placement: 'right',
    },
    {
      id: 'student-complaints',
      target: '[data-tour-id="nav-complaints"]',
      title: 'Complaints',
      description: 'Report maintenance issues or file complaints — track their resolution status here.',
      placement: 'right',
    },
  ],
};

export const adminTour: TourConfig = {
  id: 'admin-tour',
  steps: [
    {
      id: 'admin-metrics',
      target: '[data-tour-id="admin-metrics"]',
      title: 'Dashboard Metrics',
      description: 'Monitor rooms, occupancy, revenue, and complaints at a glance.',
      placement: 'bottom',
    },
    {
      id: 'admin-broadcast',
      target: '[data-tour-id="admin-broadcast"]',
      title: 'Broadcast Announcements',
      description: 'Send system-wide announcements to all students in your hostel.',
      placement: 'bottom',
    },
    {
      id: 'admin-sessions',
      target: '[data-tour-id="nav-sessions"]',
      title: 'Sessions',
      description: 'Manage academic sessions — create, activate, or close sessions to control allocations.',
      placement: 'right',
    },
    {
      id: 'admin-structure',
      target: '[data-tour-id="nav-hostel-structure"]',
      title: 'Hostel Structure',
      description: 'Set up your hostels, blocks, and floors. This is the foundation for room management.',
      placement: 'right',
    },
    {
      id: 'admin-rooms',
      target: '[data-tour-id="nav-rooms"]',
      title: 'Room Management',
      description: 'Create rooms, manage allocations, and track vacancy across all your hostels.',
      placement: 'right',
    },
    {
      id: 'admin-applications',
      target: '[data-tour-id="nav-applications"]',
      title: 'Applications',
      description: 'Review, approve, or reject student applications for hostel accommodation.',
      placement: 'right',
    },
  ],
};

export const ownerTour: TourConfig = {
  id: 'owner-tour',
  steps: [
    {
      id: 'owner-overview',
      target: '[data-tour-id="nav-overview"]',
      title: 'Owner Dashboard',
      description: 'View an overview of all your hostels and their performance.',
      placement: 'right',
    },
    {
      id: 'owner-profile',
      target: '[data-tour-id="nav-my-profile"]',
      title: 'Your Profile',
      description: 'Manage your account settings and business details.',
      placement: 'right',
    },
    {
      id: 'owner-hostels',
      target: '[data-tour-id="nav-hostels"]',
      title: 'Hostels',
      description: 'Register new hostels and manage existing ones from here.',
      placement: 'right',
    },
  ],
};

export function getTourForRole(role: string | undefined): TourConfig | null {
  switch (role) {
    case 'STUDENT': return studentTour;
    case 'HOSTEL_ADMIN': return adminTour;
    case 'HOSTEL_OWNER': return ownerTour;
    default: return null;
  }
}
