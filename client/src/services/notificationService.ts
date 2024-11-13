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
  console.log(username);
  const res = await api.get(`${NOTIFICATION_API_URL}/${username}`);
  console.log(res);

  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering notifications');
  }

  return res.data;
};

export default getNotifications;
