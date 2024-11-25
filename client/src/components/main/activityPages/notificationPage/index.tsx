import React from 'react';
import { CircularProgress } from '@mui/material';
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
    isLoading,
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
    <>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <div className='notification-div relative'>
          <h2 className='notification-title font-bold text-4xl'>Notifications Center</h2>
          <div className='flex flex-col-reverse lg:flex-col lg:items-end mx-2 lg:absolute lg:top-0 lg:right-0'>
            <button
              className='mb-2 md:mt-10 border border-black rounded px-3 py-2'
              onClick={() => setShowConfirmationModal(true)}>
              Clear all notifications
            </button>
            <div className='mb-5 md:mb-0'>
              <NotificationFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
          <div className='flex flex-col items-center'>
            {!notifications.length && (
              <div className='no-notifications'>No notifications here yet</div>
            )}
            {notifications.length > 0 && <NotificationList notifications={notifications} />}
          </div>

          {showConfirmationModal && (
            <ConfirmationDisplay
              open={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={() => handleClearNotifications()}
            />
          )}
        </div>
      )}
      ;
    </>
  );
};

export default NotificationCenter;
