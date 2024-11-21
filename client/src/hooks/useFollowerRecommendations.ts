import { useEffect, useState } from 'react';
import { User } from '../types';
import { getFollowRecommendations } from '../services/userService';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle fetching follower recommendations.
 *
 * @returns recommendations - The list of recommended users to follow.
 */
const useFollowerRecommendations = () => {
  const { user } = useUserContext();
  const [recommendations, setRecommendations] = useState<User[]>([]);

  /**
   * Fetches the list of recommended users to follow.
   */
  useEffect(() => {
    const fetchRecommendations = async () => {
      const result = await getFollowRecommendations(user.username);
      setRecommendations(result);
    };

    fetchRecommendations();
  }, [user.username]);

  return {
    recommendations,
  };
};

export default useFollowerRecommendations;
