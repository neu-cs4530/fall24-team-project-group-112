import api from './config';
import { Notification } from '../types';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Function to get all notifications for a user.
 *
 * @param username - The username of the user whose notifications are being retrieved.
 * @param type - (Optional) The type of notifications to filter by.
 * @throws Error if there is an issue fetching the notifications.
 */
const getNotifications = async (username: string, type?: string): Promise<Notification[]> => {
  let url = `${NOTIFICATION_API_URL}/${username}`;
  if (type) {
    url += `?type=${type}`;
  }

  const res = await api.get(url);

  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering notifications');
  }

  return res.data;
};

/**
 * Function to clear all notifications for a user.
 *
 * @param username - The username of the user whose notifications are being deleted.
 * @throws Error if there is an issue deleting the notifications.
 */
const clearAllNotifications = async (username: string): Promise<void> => {
  const url = `${NOTIFICATION_API_URL}/${username}`;

  const res = await api.delete(url);

  if (res.status !== 200) {
    throw new Error('Error when deleting notifications');
  }

  return res.data;
};

/**
 * Function to clear a single notification for a user.
 *
 * @param username - The username of the user whose notification is being deleted.
 * @param notificationId - The ID of the notification to delete.
 * @throws Error if there is an issue deleting the notifications.
 */
const clearSingleNotification = async (username: string, notificationId: string): Promise<void> => {
  const url = `${NOTIFICATION_API_URL}/${username}/${notificationId}`;

  const res = await api.delete(url);

  if (res.status !== 200) {
    throw new Error('Error when deleting notification');
  }

  return res.data;
};

/**
 * Function to mark notifications as seen for a user.
 *
 * @param username - The username of the user whose notifications are being marked as seen.
 * @throws Error if there is an issue updating the notifications.
 */
const markNotificationsAsSeen = async (username: string): Promise<Notification[]> => {
  const url = `${NOTIFICATION_API_URL}/seen/${username}`;

  const res = await api.patch(url);

  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering notifications');
  }

  return res.data;
};

export {
  getNotifications,
  clearAllNotifications,
  clearSingleNotification,
  markNotificationsAsSeen,
};
