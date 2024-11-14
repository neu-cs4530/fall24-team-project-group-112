import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import { getNotifications, clearAllNotifications } from '../services/notificationService';

const useNotifications = (initialType?: string) => {
  const { user, socket } = useUserContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | undefined>(initialType);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

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
    const handleNotificationUpdate = ({ notification }: { notification: Notification }) => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
    };

    fetchData();

    socket.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
    };
  }, [user.username, notificationType, socket]);

  const deleteNotifications = async () => {
    try {
      await clearAllNotifications(user.username);
      setNotifications([]);
    } catch (err) {
      setError('Failed to delete notifications');
    }
  };

  return {
    notifications,
    error,
    setNotificationType,
    deleteNotifications,
    showConfirmationModal,
    setShowConfirmationModal,
  };
};

export default useNotifications;
