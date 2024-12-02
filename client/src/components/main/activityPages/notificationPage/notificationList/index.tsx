import React from 'react';
import NotificationItem from '../notificationItem';
import { Notification } from '../../../../../types';

/**
 * NotificationListProps is an interface for the NotificationList component props.
 *
 * @param {Notification[]} notifications - The list of notifications.
 */
interface NotificationListProps {
  notifications: Notification[];
}

/**
 * NotificationList component displays a list of notifications.
 *
 * @param {Notification[]} notifications - The list of notifications.
 */
const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => (
  <ul>
    {notifications.map((notification, idx) => (
      <NotificationItem key={idx} notification={notification} />
    ))}
  </ul>
);

export default NotificationList;
