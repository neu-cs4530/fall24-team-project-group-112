import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Follow, User } from '../types';
import { getFollowers, getUser, updateProfile } from '../services/userService';

/**
 * Custom hook to user profiles.
 *
 * @returns user - The user object for the profile page.
 */
const useProfile = () => {
  // const { socket } = useUserContext();

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
    const handleSave = async () => {
      try {
        if (user !== undefined) {
          const updatedUser = await updateProfile(user.username, {
            ...Object.fromEntries(
              Object.entries(formData).filter(([_, value]) => value !== undefined),
            ),
          });
          console.log(formData);
          setIsEditing(false);
          setUser(updatedUser);
        }
      } catch (err) {
        setError('An error occurred while saving the profile data.');

        // eslint-disable-next-line no-console
        console.log(err);
      }
    };

    fetchUser();

    // socket.on('profileUpdate', handleSave);
    return () => {
      // socket.off('profileUpdate', handleSave);
    };
  }, [username]);

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
  };
};

export default useProfile;
