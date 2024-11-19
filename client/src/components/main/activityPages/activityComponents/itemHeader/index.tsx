import React from 'react';
import { Link } from 'react-router-dom';
import useUserAvatar from '../../../../../hooks/useUserAvatar';
import Avatar from '../../../baseComponents/avatar';

/**
 * ItemHeader component displays the header of a notification or feed item.
 *
 * @param {string} username - The username of the user.
 * @param {string} headerText - The header text. This field is optional.
 */
interface ItemHeaderProps {
  username: string;
  headerText?: string;
}

/**
 * ItemHeader component displays the header of a notification or feed item.
 *
 * @param {string} username - The username of the user.
 * @param {string} headerText? - The header text. This field is optional.
 */
const ItemHeader: React.FC<ItemHeaderProps> = ({ username, headerText }) => {
  const userAvatar = useUserAvatar(username);
  return (
    <Link to={`/profile/${username}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: headerText ? '1px' : '8px',
        }}>
        <Avatar avatarName={userAvatar} width={30} height={30} circular={true} />
        <span className='user-in-notification'>&nbsp;{username}&nbsp;</span>
        {headerText && <span>{headerText}</span>}
      </div>
    </Link>
  );
};

export default ItemHeader;
