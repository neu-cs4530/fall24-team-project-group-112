import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types';
import { getUser } from '../services/userService';

/**
 * Custom hook to user profiles.
 *
 * @returns user - The user object for the profile page.
 */
const useProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      if (username) {
        try {
          const retrievedUser = await getUser(username);

          setUser(retrievedUser);
        } catch (err) {
          setError('An error occurred while fetching the user.');

          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [username]);

  return { user, error };
};

export default useProfile;
