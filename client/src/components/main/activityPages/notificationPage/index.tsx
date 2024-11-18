import React from 'react';
import useNotifications from '../../../../hooks/useNotifications';
import NotificationList from './notificationList';
import NotificationFilter from './filterComponent';
import './index.css';

const NotificationCenter: React.FC = () => {
  const { notifications, error, setNotificationType } = useNotifications();

  const handleFilterChange = (type: string) => {
    setNotificationType(type);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='notification-div'>
      <h2 className='notification-title font-bold text-4xl'>Notifications Center</h2>

      <div className='mb-5'>
        <NotificationFilter onFilterChange={handleFilterChange} />
      </div>

      {!notifications.length && <div className='no-notifications'>No notifications here yet</div>}

      {notifications.length > 0 && <NotificationList notifications={notifications} />}
    </div>
  );
};

export default NotificationCenter;
