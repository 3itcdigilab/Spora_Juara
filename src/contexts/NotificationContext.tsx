import React, { createContext, useContext, useState } from 'react';
interface NotificationContextType { notifications: any[]; unreadCount: number; markAsRead: (id: string) => void; addNotification: (n: any) => void; }
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const addNotification = (n: any) => setNotifications(prev => [n, ...prev]);
  return <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, addNotification }}>{children}</NotificationContext.Provider>;
};
export const useNotifications = () => { const ctx = useContext(NotificationContext); if (!ctx) throw new Error('useNotifications must be used within NotificationProvider'); return ctx; };