import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import {
  getNotifications,
  clearAllNotifications,
  clearSingleNotification,
  markNotificationsAsSeen,
} from '../services/notificationService';

const useNotifications = (initialType?: string) => {
  const { user, socket } = useUserContext();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | undefined>(initialType);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState<number>(0);

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

        if (location.pathname !== '/notification') {
          setUnseenNotificationCount(res.filter(notification => !notification.seen).length);
        } else {
          setUnseenNotificationCount(0);
          await markNotificationsAsSeen(user.username); // mark them seen for the future
        }
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
    const handleNotificationUpdate = async (notification: Notification) => {
      // only update notification list if the notification is for the specified user and
      // the type matches the current filter
      if (
        notification.receiverUsername === user.username &&
        (!notificationType || notificationType === notification.notificationType)
      ) {
        if (location.pathname !== '/notification') {
          setUnseenNotificationCount(prevCount => prevCount + 1);
        } else {
          setUnseenNotificationCount(0);
          await markNotificationsAsSeen(user.username);
          setNotifications(prevNotifications => [notification, ...prevNotifications]);
        }
      }
    };

    /**
     * Handles real-time updates via socket events for deleted notifications.
     *
     * @param notificationId - The id of the notification that was deleted
     */
    const handleNotificationDelete = async (notificationId: string) => {
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId),
      );
    };

    fetchData();

    socket.on('notificationUpdate', handleNotificationUpdate);
    socket.on('notificationDelete', handleNotificationDelete);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
      socket.off('notificationDelete', handleNotificationDelete);
    };
  }, [user.username, notificationType, location.pathname, unseenNotificationCount, socket]);

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
    unseenNotificationCount,
    setUnseenNotificationCount,
  };
};

export default useNotifications;
