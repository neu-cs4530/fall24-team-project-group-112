import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../../baseComponents/avatar';
import useUserAvatar from '../../../../../hooks/useUserAvatar';

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

  const styles = {
    container: 'flex items-center',
    link: `flex items-center ${!headerText ? 'mb-2' : ''}`,
    username: 'font-bold mx-1.5',
  };

  return (
    <div className={styles.container}>
      <Link to={`/profile/${username}`} className={styles.link}>
        <Avatar avatarName={userAvatar} width={20} height={20} circular={true} />
        <span className={styles.username}>{username}</span>
      </Link>
      {headerText && <span>{headerText}</span>}
    </div>
  );
};

export default ItemHeader;
