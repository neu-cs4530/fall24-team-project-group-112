import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import getNotifications from '../services/notificationService';
import { Notification } from '../types';

const useNotifications = (initialType?: string) => {
  const { user, socket } = useUserContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | undefined>(initialType);

  useEffect(() => {
    /**
     * Fetches notifications based on the selected filter and updates the notification list.
     */
    const fetchData = async () => {
      if (!user.username) {
        setError('Username not available');
        return;
      }

      setError(null);

      try {
        const res = await getNotifications(user.username, notificationType);
        setNotifications(res || []);
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };

    /**
     * Handles real-time updates via socket events for new or updated notifications.
     *
     * @param notification - The new or updated notification object.
     */
    const handleNotificationUpdate = (notification: Notification) => {
      // only update notification list if the notification type matches the current filter
      if (!notificationType || notificationType === notification.notificationType) {
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
      }
    };

    fetchData();

    socket.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
    };
  }, [user.username, notificationType, socket]);

  return {
    notifications,
    error,
    setNotificationType,
  };
};

export default useNotifications;
