import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../../types';
import useUserAvatar from '../../../../../hooks/useUserAvatar';
import './index.css';
import Avatar from '../../../baseComponents/avatar';
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
            <ItemHeader username={follow.followerUsername} />
            <span style={{ marginBottom: '4%', paddingLeft: '8%', paddingRight: '4%' }}>
              followed
            </span>
            <ItemHeader username={follow.followeeUsername} />
          </div>
        )}
      </div>
      <RiDeleteBin5Line className='trash-icon' />
    </div>
  </div>
);

export default FollowItem;
