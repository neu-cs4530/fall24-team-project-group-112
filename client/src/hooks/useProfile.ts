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
          const ex: User = {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            githubUrl: 'hello',
            email: 'john.doe@example.com',
            badges: [],
            createdAt: new Date(),
          };
          // const user = await getUser(username);

          setUser(ex);
        } catch (err) {
          // eslint-disable-next-line no-console
          setError('An error occurred while fetching the user.');
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [username]);

  return { user, setUser, error };
};

export default useProfile;
