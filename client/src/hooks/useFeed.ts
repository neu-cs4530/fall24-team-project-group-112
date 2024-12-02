import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import { FeedPost } from '../types';
import { getFeed } from '../services/userService';

/**
 * Custom hook for managing the feed state and fetching feed items.
 *
 * @param initialType - The initial feed item type to filter by.
 * @returns feedItems - The list of feed items.
 */
const useFeed = (initialType?: string) => {
  const { user } = useUserContext();

  const [feedItems, setFeedItems] = useState<FeedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedItemType, setFeedItemType] = useState<string | undefined>(initialType);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Fetches feed items based on the selected filter and updates the feed list.
     */
    const fetchData = async () => {
      if (!user.username) {
        setError('Username not available');
        return;
      }

      setError(null);

      try {
        const res = await getFeed(user.username, feedItemType);
        setFeedItems(res || []);
      } catch (err) {
        setError('Failed to fetch feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.username, feedItemType]);

  return {
    feedItems,
    error,
    setFeedItemType,
    isLoading,
  };
};

export default useFeed;
