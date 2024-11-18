import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../../types';
import './index.css';

interface FollowItemProps {
  follow: Follow;
  itemType: 'notification' | 'feed';
}

const FollowItem: React.FC<FollowItemProps> = ({ follow, itemType }) => (
  <div className='notification'>
    <div className='notification-header'>
      <div>
        <span className='user-in-notification'>{follow.followerUsername}</span>
        <> </>

        {itemType === 'notification' ? (
          `followed you`
        ) : (
          <>
            followed <span className='user-in-notification'>{follow.followeeUsername}</span>
          </>
        )}
      </div>
      <RiDeleteBin5Line className='trash-icon' />
    </div>
  </div>
);

export default FollowItem;
