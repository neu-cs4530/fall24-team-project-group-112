import React, { useState } from 'react';
import useNotifications from '../../../hooks/useNotifications';
import NotificationList from './notificationList';
import NotificationFilter from './filterComponent';
import './index.css';

const NotificationCenter = () => {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);

  const { notifications, error } = useNotifications(filterType);

  if (!notifications.length && !error) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='notification-div'>
      <h2 className='notification-title'>Notification Center</h2>
      <NotificationList notifications={notifications} />
      <NotificationFilter onFilterChange={setFilterType} />
    </div>
  );
};

export default NotificationCenter;
