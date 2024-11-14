import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Follow, User } from '../types';
import { getFollowers, getUser, updateProfile } from '../services/userService';
import useUserContext from './useUserContext';

/**
 * Custom hook to user profiles.
 *
 * @param userProfile - The initial user object for the profile page.
 *
 * @returns user - The user object for the profile page.
 */
const useProfile = () => {
  const { socket } = useUserContext();
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || undefined,
    avatarName: user?.avatarName || 'avatar1',
    headline: user?.headline || undefined,
    githubUrl: user?.githubUrl || undefined,
    school: user?.school || undefined,
    city: user?.city || undefined,
    state: user?.state || undefined,
    company: user?.company || undefined,
    bio: user?.bio || undefined,
  });

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
        headline: user.headline !== undefined ? user.headline : undefined,
        githubUrl: user.githubUrl !== undefined ? user.githubUrl : undefined,
        school: user.school !== undefined ? user.school : undefined,
        city: user.city !== undefined ? user.city : undefined,
        state: user.state !== undefined ? user.state : undefined,
        company: user.company !== undefined ? user.company : undefined,
        bio: user.bio !== undefined ? user.bio : undefined,
      });
    }
  }, [user]);

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

    const handleProfileUpdate = (updatedUser: User) => {
      setUser(updatedUser);
    };

    fetchUser();

    socket.on('profileUpdate', handleProfileUpdate);
    return () => {
      socket.off('profileUpdate', handleProfileUpdate);
    };
  }, [username, socket]);

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
  };
};

export default useProfile;
