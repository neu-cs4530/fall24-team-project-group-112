import { useState } from 'react';
import { User } from '../types';
import useLocalStorage from './useLocalStorage';

let userInstance: User | null = null;
let setUserInstance: ((user: User | null) => void) | null = null;

/**
 * Custom hook to access the current user.
 *
 * @returns user - The current user object containing the logged in user's information, or null if a user is not logged in.
 * @returns setUser - The function to update the current user object.
 *
 */
const useUser = () => {
  const { getItem } = useLocalStorage();

  if (userInstance === null) {
    const userItem = getItem('user');
    userInstance = userItem ? JSON.parse(userItem) : null;
  }

  const [user, setUser] = useState<User | null>(userInstance);

  if (setUserInstance === null) {
    setUserInstance = setUser;
  }

  const setUserWrapper = (newUser: User | null) => {
    userInstance = newUser;
    if (setUserInstance) {
      setUserInstance(newUser);
    }
  };

  return { user, setUser: setUserWrapper };
};

export default useUser;
