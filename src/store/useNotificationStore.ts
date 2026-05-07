import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchNotifications: async (userId) => {
        if (!userId) return;
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/notifications?userId=${userId}`);
          const result = await response.json();
          if (result.success) {
            const notifications = result.data.map((n: any) => ({
              ...n,
              isRead: Boolean(n.isRead)
            }));
            set({ 
              notifications, 
              unreadCount: notifications.filter((n: any) => !n.isRead).length,
              isLoading: false 
            });
          } else {
            set({ error: result.error, isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      markAsRead: async (notificationId) => {
        try {
          const response = await fetch('/api/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId })
          });
          const result = await response.json();
          
          if (result.success) {
            const newNotifications = get().notifications.map(n => 
              n.id === notificationId ? { ...n, isRead: true } : n
            );
            set({ 
              notifications: newNotifications,
              unreadCount: newNotifications.filter(n => !n.isRead).length
            });
          }
        } catch (err) {
          console.error('Failed to mark notification as read:', err);
        }
      },

      setNotifications: (notifications) => set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }),
    }),
    {
      name: 'gourmate-notifications',
    }
  )
);
