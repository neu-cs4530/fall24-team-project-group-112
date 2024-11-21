import { useState, useEffect } from 'react';
import { getUser } from '../services/userService';
import { User } from '../types';

/**
 * Custom hook to get a user's avatar.
 * @param username - The username of the user.
 *
 * @returns avatarName - The name of the user's avatar.
 */
const useUserAvatar = (username: string) => {
  const [avatarName, setAvatarName] = useState<string>('avatar1');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const user: User = await getUser(username);
        setAvatarName(user.avatarName || 'avatar1');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    };

    fetchAvatar();
  }, [username]);

  return avatarName;
};

export default useUserAvatar;
