import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../types';
import './index.css';

interface FollowNotificationProps {
  follow: Follow;
}

const FollowNotification: React.FC<FollowNotificationProps> = ({ follow }) => (
  <div className='notification'>
    <div className='notification-header'>
      <div>
        <span className='user-in-notification'>{follow.followerUsername}</span> followed you
      </div>
      <RiDeleteBin5Line className='trash-icon' />
    </div>
  </div>
);

export default FollowNotification;
