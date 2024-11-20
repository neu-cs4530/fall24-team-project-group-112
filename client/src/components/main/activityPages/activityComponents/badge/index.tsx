import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Badge } from '../../../../../types';
import './index.css';

interface BadgeNotificationProps {
  badge: Badge;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge }) => {
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
    circle: 'w-3 h-3 rounded-full mr-2',
  };

  return (
    <div className='notification'>
      <div className='notification-header'>
        <div className={styles.badgeContainer}>
          <div className={styles.circle} style={{ backgroundColor: getCircleColor() }}></div>
          <div>
            You earned the <span className='font-bold'>{badge.name.toLowerCase()}</span> badge
          </div>
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
    </div>
  );
};

export default BadgeNotification;
