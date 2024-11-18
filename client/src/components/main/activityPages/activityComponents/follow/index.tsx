import React from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Follow } from '../../../../../types';
import useUserAvatar from '../../../../../hooks/useUserAvatar';
import './index.css';
import Avatar from '../../../baseComponents/avatar';

interface FollowItemProps {
  follow: Follow;
  itemType: 'notification' | 'feed';
}

const FollowItem: React.FC<FollowItemProps> = ({ follow, itemType }) => {
  const followerAvatar = useUserAvatar(follow.followerUsername);
  const followeeAvatar = useUserAvatar(follow.followeeUsername);

  return (
    <div className='notification'>
      <div className='notification-header'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to={`/profile/${follow.followerUsername}`}
            style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar avatarName={followerAvatar} width={30} height={30} circular={true} />
            <span className='user-in-notification'>&nbsp;{follow.followerUsername}</span>
          </Link>
          {itemType === 'notification' ? (
            ' followed you'
          ) : (
            <>
              &nbsp; followed &nbsp;
              <Link
                to={`/profile/${follow.followeeUsername}`}
                style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar avatarName={followeeAvatar} width={30} height={30} circular={true} />
                <span className='user-in-notification'>&nbsp;{follow.followeeUsername}</span>
              </Link>
            </>
          )}
        </div>
        <RiDeleteBin5Line className='trash-icon' />
      </div>
    </div>
  );
};

export default FollowItem;
