import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Follow, User } from '../types';
import { getFollowers, getUser, addFollow } from '../services/userService';

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
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchUser = useCallback(async () => {
    if (username) {
      try {
        const retrievedUser = await getUser(username);
        setUser(retrievedUser);
        const result = await getFollowers(username);
        setFollowers(result.followers);
        setFollowing(result.following);
      } catch (err) {
        setError('An error occurred while fetching the user and/or followers.');
        console.log(err); // eslint-disable-line no-console
      }
    }
  }, [username]);

  const postFollow = async (followerUsername: string, followeeUsername: string) => {
    if (!followerUsername || !followeeUsername) {
      setError('An error occurred while following the user.');
      return;
    }

    try {
      const res = await addFollow(followerUsername, followeeUsername);
      if (res) {
        setError('');
        await fetchUser();
      }
    } catch (err) {
      if (err instanceof Error) {
        setShowErrorModal(true);
        setError(`An error occurred while following the user`);
      }
    }
  };

  return {
    user,
    followers,
    following,
    followersOpen,
    setFollowersOpen,
    followingOpen,
    setFollowingOpen,
    error,
    showErrorModal,
    setShowErrorModal,
    postFollow,
  };
};

export default useProfile;
