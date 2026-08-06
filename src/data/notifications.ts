import { Notification } from './types';
export const mockNotifications: Notification[] = Array.from({ length: 20 }, (_, i) => ({
  id: `notif-${i + 1}`, userId: `user-${(i % 5) + 1}`, type: 'system',
  title: 'System Update', message: 'Platform has been updated.', actionUrl: '/',
  isRead: i % 2 === 0, createdAt: new Date().toISOString()
}));