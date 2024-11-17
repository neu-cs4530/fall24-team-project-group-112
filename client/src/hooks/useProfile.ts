import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Follow, User } from '../types';
import { getFollowers, getUser, updateProfile, addFollow } from '../services/userService';
import useUserContext from './useUserContext';

/**
 * Custom hook to user profiles.
 * @param loggedInUser - The logged-in user, or null if a user is not logged in.
 *
 * @returns user - The user object for the profile page.
 */
const useProfile = (loggedInUser: User | null) => {
  const { socket } = useUserContext();
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username,
    avatarName: user?.avatarName || 'avatar1',
    headline: user?.headline,
    githubUrl: user?.githubUrl,
    school: user?.school,
    city: user?.city,
    state: user?.state,
    company: user?.company,
    bio: user?.bio,
  });

  useEffect(() => {
    setIsFollowing(followers.some(follow => follow.user.username === loggedInUser?.username));
  }, [followers, loggedInUser]);

  const handleSave = async () => {
    if (user) {
      if (formData.firstName.trim() === '' || formData.lastName.trim() === '') {
        setError('First Name and Last Name cannot be empty');
        return;
      }

      const checkGithubUrl = /^https?:\/\/github\.com\/([a-zA-Z0-9._-]+)$/;
      if (formData.githubUrl && !checkGithubUrl.test(formData.githubUrl)) {
        setError('Enter a valid GitHub URL');
        return;
      }
      try {
        const updatedUser = await updateProfile(user.username, {
          ...Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== undefined),
          ),
        });
        setIsEditing(false);
        setUser(updatedUser);
        setError('');
      } catch (err) {
        setError('An error occurred while saving the profile data.');

        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectAvatar = (avatarName: string) => {
    setFormData(prevState => ({
      ...prevState,
      avatarName,
    }));
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarName: user?.avatarName || 'avatar1',
        headline: user.headline,
        githubUrl: user.githubUrl,
        school: user.school,
        city: user.city,
        state: user.state,
        company: user.company,
        bio: user.bio,
      });
    }
  }, [user]);

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

  useEffect(() => {
    const handleProfileUpdate = async (updatedUser: User) => {
      setUser(updatedUser);
    };
    fetchUser();

    socket.on('profileUpdate', handleProfileUpdate);
    return () => {
      socket.off('profileUpdate', handleProfileUpdate);
    };
  }, [fetchUser, socket]);

  useEffect(() => {
    const handleFollowUpdate = async () => {
      setIsFollowing(!isFollowing);
    };
    socket.on('followUpdate', handleFollowUpdate);
    return () => {
      socket.off('followUpdate', handleFollowUpdate);
    };
  }, [socket, isFollowing]);

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
    setUser,
    followers,
    following,
    followersOpen,
    setFollowersOpen,
    followingOpen,
    setFollowingOpen,
    avatarOpen,
    setAvatarOpen,
    error,
    setError,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleSave,
    handleChange,
    handleSelectAvatar,
    showErrorModal,
    setShowErrorModal,
    postFollow,
    isFollowing,
    setIsFollowing,
  };
};

export default useProfile;
