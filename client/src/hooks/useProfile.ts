import React, { useState, useEffect } from 'react';
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
          const user = await getUser(username);

          setUser(user);
        } catch (error) {
          // eslint-disable-next-line no-console
          setError('An error occurred while fetching the user.');
          console.log(error);
        }
      }
    };
    fetchUser();
  }, [username]);

  return { user, setUser, error };
};

export default useProfile;
