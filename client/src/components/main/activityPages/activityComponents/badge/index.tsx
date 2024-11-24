import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Badge } from '../../../../../types';
import './index.css';
import useNotifications from '../../../../../hooks/useNotifications';

/**
 * BadgeNotification component displays a notification for a badge earned.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed.
 * @param {Badge} badge - The badge object.
 */
interface BadgeNotificationProps {
  notificationId?: string;
  badge: Badge;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ notificationId, badge }) => {
  const getCircleColor = () => {
    switch (badge.color) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      case 'bronze':
        return '#803b06';
      default:
        return '#000';
    }
  };

  const styles = {
    badgeContainer: 'flex items-center',
    circle: 'w-5 h-5 rounded-full mr-2',
  };

  const { deleteNotification } = useNotifications();

  return (
    <div className='flex flex-col border border-gray-600 p-4 rounded-md w-full md:w-[500px]'>
      <div className='notification-header'>
        <div className={styles.badgeContainer}>
          <div className={styles.circle} style={{ backgroundColor: getCircleColor() }}></div>
          <div>
            You earned the <span className='font-bold'>{badge.name?.toLowerCase()}</span> badge
          </div>
        </div>
        {notificationId && (
          <button onClick={() => deleteNotification(notificationId)} className='trash-icon'>
            <RiDeleteBin5Line />
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgeNotification;
