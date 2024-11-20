import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import {
  getNotifications,
  clearAllNotifications,
  clearSingleNotification,
} from '../services/notificationService';

const useNotifications = (initialType?: string) => {
  const { user, socket } = useUserContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | undefined>(initialType);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Handles real-time updates via socket events for new or updated notifications.
     *
     * @param notification - The new or updated notification object.
     */
    const handleNotificationUpdate = (notification: Notification) => {
      // only update notification list if the notification is for the specified user and
      // the type matches the current filter
      if (
        notification.receiverUsername === user.username &&
        (!notificationType || notificationType === notification.notificationType)
      ) {
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
      }
    };

    fetchData();

    socket.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
    };
  }, [user.username, notificationType, notifications, socket]);

  const deleteNotifications = async () => {
    try {
      setNotifications([]);
      await clearAllNotifications(user.username);
    } catch (err) {
      setError('Failed to delete notifications');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId),
      );
      await clearSingleNotification(user.username, notificationId);
    } catch (err) {
      setError('Failed to delete notifications');
    }
  };

  return {
    notifications,
    error,
    setNotificationType,
    deleteNotifications,
    deleteNotification,
    showConfirmationModal,
    setShowConfirmationModal,
    isLoading,
  };
};

export default useNotifications;
