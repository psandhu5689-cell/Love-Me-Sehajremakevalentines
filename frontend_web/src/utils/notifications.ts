// Notification utilities
const NOTIFICATION_HISTORY_KEY = 'notification_history';
const COUPLE_CODE_KEY = 'couple_code';
const PUSH_SUBSCRIPTION_KEY = 'push_subscription';

export interface NotificationEntry {
  id: string;
  type: 'emergency' | 'emergency_resolved' | 'heart_to_heart' | 'general';
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export const notificationStorage = {
  getHistory: (): NotificationEntry[] => {
    try {
      const data = localStorage.getItem(NOTIFICATION_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addNotification: (notification: Omit<NotificationEntry, 'id' | 'timestamp' | 'read'>) => {
    const history = notificationStorage.getHistory();
    const entry: NotificationEntry = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };
    history.unshift(entry);
    // Keep last 50 notifications
    const trimmed = history.slice(0, 50);
    localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmed));
    return entry;
  },

  markAsRead: (id: string) => {
    const history = notificationStorage.getHistory();
    const updated = history.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updated));
  },

  markAllAsRead: () => {
    const history = notificationStorage.getHistory();
    const updated = history.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updated));
  },

  getUnreadCount: (): number => {
    return notificationStorage.getHistory().filter(n => !n.read).length;
  },

  getCoupleCode: (): string | null => {
    return localStorage.getItem(COUPLE_CODE_KEY);
  },

  setCoupleCode: (code: string) => {
    localStorage.setItem(COUPLE_CODE_KEY, code);
  },
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const showLocalNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192.png' });
  }
  notificationStorage.addNotification({ type: 'general', title, body });
};