import React from 'react';
import NotificationItem from '../notificationItem';
import { Notification } from '../../../../../types';

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => (
  <ul>
    {notifications.map((notification, idx) => (
      <NotificationItem key={idx} notification={notification} />
    ))}
  </ul>
);

export default NotificationList;
