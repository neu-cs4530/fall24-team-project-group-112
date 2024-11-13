import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import getNotifications from '../services/notificationService';
import { Notification } from '../types';

const useNotifications = (type?: string) => {
  const { user, socket } = useUserContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string | undefined>(type);

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchData = async () => {
      if (!user.username) {
        setError('Username not available');
        return;
      }

      setError(null);

      try {
        const res = await getNotifications(user.username, type);
        console.log(res);
        setNotifications(res || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    };

    fetchData();
  }, [user.username, type]);

  // Handle real-time updates via socket events
  useEffect(() => {
    /**
     * Function to handle new notification received via socket.
     *
     * @param notification - The new notification object.
     */
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prevNotifications => [notification, ...prevNotifications]);
    };

    /**
     * Function to handle notification updates via socket.
     *
     * @param updatedNotification - The updated notification object.
     */
    const handleNotificationUpdate = (updatedNotification: Notification) => {
      setNotifications(prevNotifications =>
        prevNotifications.map(n => (n._id === updatedNotification._id ? updatedNotification : n)),
      );
    };

    /**
     * Function to handle notification deletion via socket.
     *
     * @param id - The ID of the deleted notification.
     */
    const handleNotificationDelete = (id: string) => {
      setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== id));
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('notificationUpdate', handleNotificationUpdate);
    socket.on('notificationDelete', handleNotificationDelete);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('notificationUpdate', handleNotificationUpdate);
      socket.off('notificationDelete', handleNotificationDelete);
    };
  }, [socket]);

  return { notifications, error, setNotificationType };
};

export default useNotifications;
