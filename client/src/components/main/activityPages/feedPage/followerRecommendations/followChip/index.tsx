import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUserAvatar from '../../../../../../hooks/useUserAvatar';
import Avatar from '../../../../baseComponents/avatar';
import { addFollow } from '../../../../../../services/userService';
import useUserContext from '../../../../../../hooks/useUserContext';

/**
 * FollowChip component displays a user to follow.
 *
 * @param {string} username - The username of the user.
 */
interface FollowChipProps {
  followeeUsername: string;
  followeeName: string;
}

/**
 * FollowChip component displays a user to follow.
 *
 * @param {string} followeeUsername - The username of the user.
 * @param {string} followeeName - The display name of the user.

 */
const FollowChip: React.FC<FollowChipProps> = ({ followeeUsername, followeeName }) => {
  const { user } = useUserContext();
  const userAvatar = useUserAvatar(followeeUsername);
  const [followed, setFollowed] = useState(false);

  const handleFollowClick = async () => {
    setFollowed(oldFollow => !oldFollow);
    await addFollow(user.username, followeeUsername);
  };

  return (
    <div className='flex justify-between items-center hover:bg-gray-200 rounded-lg px-2'>
      <Link
        to={`/profile/${followeeUsername}`}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Avatar avatarName={userAvatar} width={40} height={40} circular={true} />
        <div className='flex flex-col gap-0 ml-4'>
          <p className='font-bold'>{followeeUsername}</p>
          <p className=''>{followeeName}</p>
        </div>
      </Link>
      <button
        className={`${followed ? 'bg-gray-200 hover:bg-white' : 'text-white bg-stackpurple border'}  rounded-md px-2 py-1`}
        onClick={() => handleFollowClick()}>
        {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default FollowChip;
