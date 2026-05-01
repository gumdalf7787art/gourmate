import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: 1,
          type: 'system',
          message: 'Gourmate에 오신 것을 환영합니다! 🎉 당신만의 진정성 있는 맛집 지도를 만들어보세요.',
          time: '1시간 전',
          isRead: true
        },
        {
          id: 2,
          type: 'guide',
          message: '하단 중앙의 [+] 버튼을 눌러 당신의 첫 번째 맛집 포스팅을 시작해 보세요!',
          time: '30분 전',
          isRead: true
        },
        {
          id: 3,
          type: 'guide',
          message: '다른 미식가들을 팔로우하고 그들의 숨은 맛집 리스트를 실시간으로 확인해 보세요.',
          time: '10분 전',
          isRead: true
        },
        {
          id: 4,
          type: 'follow',
          message: "미식가 '성수동주민'님이 회원님을 팔로우하기 시작했습니다. 👤",
          time: '방금 전',
          isRead: false
        },
        {
          id: 5,
          type: 'system',
          message: "회원님의 '나만 알고 싶은 카페' 테마에 새로운 장소가 추천되었습니다. ☕",
          time: '방금 전',
          isRead: false
        },
        {
          id: 6,
          type: 'system',
          message: '이번 주 Gourmate 인기 가이드 후보로 선정되셨습니다! 축하드려요! 🏅',
          time: '방금 전',
          isRead: false
        }
      ],
      unreadCount: 3,
      setNotifications: (notifications) => set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }),
      markAsRead: (id) => set((state) => {
        const newNotifications = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter(n => !n.isRead).length
        };
      }),
    }),
    {
      name: 'gourmate-notifications',
    }
  )
);
