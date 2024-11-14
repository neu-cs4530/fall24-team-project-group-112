import React from 'react';
import useNotifications from '../../../../hooks/useNotifications';
import NotificationList from './notificationList';
import NotificationFilter from './filterComponent';
import ConfirmationDisplay from './confirmation';
import './index.css';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    error,
    setNotificationType,
    deleteNotifications,
    showConfirmationModal,
    setShowConfirmationModal,
  } = useNotifications();

  const handleFilterChange = (type: string) => {
    setNotificationType(type);
  };

  const handleClearNotifications = () => {
    deleteNotifications();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='notification-div'>
      <h2 className='notification-title font-bold text-4xl'>Notifications Center</h2>

      <div className='flex'>
        <button
          className='mb-5 border border-black rounded px-3 py-2 ml-auto'
          onClick={() => setShowConfirmationModal(true)}>
          Clear all notifications
        </button>
      </div>

      <div className='mb-5'>
        <NotificationFilter onFilterChange={handleFilterChange} />
      </div>

      {!notifications.length && <div className='no-notifications'>No notifications here yet</div>}

      {notifications.length > 0 && <NotificationList notifications={notifications} />}

      {showConfirmationModal && (
        <ConfirmationDisplay
          open={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={() => handleClearNotifications()}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
