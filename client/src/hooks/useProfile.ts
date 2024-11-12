import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Follow, User } from '../types';
import { getFollowers, getUser } from '../services/userService';

/**
 * Custom hook to user profiles.
 *
 * @returns user - The user object for the profile page.
 */
const useProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      if (username) {
        try {
          const retrievedUser = await getUser(username);
          setUser(retrievedUser);
          const result = await getFollowers(username);
          setFollowers(result.followers);
          setFollowing(result.following);
        } catch (err) {
          setError('An error occurred while fetching the user and/or followers.');

          // eslint-disable-next-line no-console
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [username]);

  return {
    user,
    followers,
    following,
    followersOpen,
    setFollowersOpen,
    followingOpen,
    setFollowingOpen,
    error,
  };
};

export default useProfile;
