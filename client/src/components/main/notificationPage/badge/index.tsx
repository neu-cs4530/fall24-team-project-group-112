import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Badge } from '../../../../types';
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
        return '#CD7F32';
      default:
        return '#000';
    }
  };
  return (
    <div className='notification'>
      <div className='notification-header'>
        <div>
          <div className='circle' style={{ backgroundColor: getCircleColor() }}></div>
          <div>You earned the {badge.name} badge</div>
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
    </div>
  );
};

export default BadgeNotification;
