import React from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../../types';
import './index.css';
import ItemHeader from '../itemHeader';

interface FollowItemProps {
  follow: Follow;
  itemType: 'notification' | 'feed';
}

const FollowItem: React.FC<FollowItemProps> = ({ follow, itemType }) => (
  <div className='notification'>
    <div className='notification-header'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {itemType === 'notification' ? (
          <ItemHeader username={follow.followerUsername} headerText={` followed you.`} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <ItemHeader username={follow.followerUsername} headerText={`followed`} />
            &nbsp; &nbsp;
            <ItemHeader username={follow.followeeUsername} />
          </div>
        )}
      </div>
      {itemType === 'notification' && <RiDeleteBin5Line className='trash-icon' />}
    </div>
  </div>
);

export default FollowItem;
