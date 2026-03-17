import type { StateCreator } from 'zustand';
import type {
  Notification,
  NotificationsResponse,
  BroadcastAnnouncementPayload,
  ApiError,
} from '@/types';
import { api } from '@/lib/api';

interface WithToken { token: string | null; }

export interface NotificationsSlice {
  notifications: Notification[];
  unreadCount: number;
  notificationsLoading: boolean;
  notificationsError: string | null;

  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  broadcastAnnouncement: (payload: BroadcastAnnouncementPayload) => Promise<boolean>;
  addNotification: (notification: Notification) => void;
}

export const createNotificationsSlice: StateCreator<NotificationsSlice & WithToken, [], [], NotificationsSlice> = (set, get) => ({
  notifications: [],
  unreadCount: 0,
  notificationsLoading: false,
  notificationsError: null,

  fetchNotifications: async () => {
    set({ notificationsLoading: true, notificationsError: null });
    try {
      const token = get().token ?? undefined;
      const response = await api.get<NotificationsResponse>('/notifications/all', token);
      set({
        notifications: response.notifications || [],
        unreadCount: response.unreadCount || 0,
        notificationsLoading: false
      });
    } catch (err) {
      set({ notificationsLoading: false, notificationsError: (err as ApiError).message });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const token = get().token ?? undefined;
      await api.patch<{ message: string }>(`/notifications/${notificationId}/read`, {}, token);
      
      set((state) => {
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          const updated = state.notifications.map((n) => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          return {
            notifications: updated,
            unreadCount: Math.max(0, state.unreadCount - 1)
          };
        }
        return state;
      });
      return true;
    } catch {
      return false;
    }
  },

  markAllAsRead: async () => {
    try {
      const token = get().token ?? undefined;
      await api.patch<{ message: string }>('/notifications/read-all', {}, token);
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
      return true;
    } catch {
      return false;
    }
  },

  broadcastAnnouncement: async (payload) => {
    try {
      const token = get().token ?? undefined;
      await api.post<{ message: string }>('/notifications/broadcast-announcement', payload, token);
      return true;
    } catch (err) {
      return false;
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
});
