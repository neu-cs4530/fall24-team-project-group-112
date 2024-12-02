import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Badge } from '../../../../../types';
import useNotifications from '../../../../../hooks/useNotifications';
import { getMetaData } from '../../../../../tool';

/**
 * BadgeNotification component displays a notification for a badge earned.
 *
 * @param {string} notificationId - The id of the notification. If present, the delete button will be displayed.
 * @param {Badge} badge - The badge object.
 */
interface BadgeNotificationProps {
  notificationId?: string;
  date: Date;
  badge: Badge;
}

/**
 * Displays a notification for a badge earned.
 * @param {BadgeNotificationProps} props - The props for the component.
 * @returns {JSX.Element} The BadgeNotification component.
 */
const BadgeNotification: React.FC<BadgeNotificationProps> = ({ notificationId, date, badge }) => {
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
    <div className='flex flex-col border border-gray-600 p-4 rounded-md w-full lg:w-[550px]'>
      <div className='notification-header'>
        <div>
          <div className={styles.badgeContainer}>
            <div className={styles.circle} style={{ backgroundColor: getCircleColor() }}></div>
            <div>
              You earned the <span className='font-bold'>{badge.name?.toLowerCase()}</span> badge
            </div>
          </div>
          <p className='text-gray-500'>{getMetaData(new Date(date))}</p>
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
