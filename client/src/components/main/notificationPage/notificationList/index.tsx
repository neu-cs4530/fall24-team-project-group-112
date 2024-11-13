import React from 'react';
import NotificationItem from '../notificationItem';
import { Notification } from '../../../../types';

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => (
  <ul>
    {notifications
      .slice()
      .reverse()
      .map(notification => (
        <NotificationItem key={notification._id} notification={notification} />
      ))}
  </ul>
);

export default NotificationList;
