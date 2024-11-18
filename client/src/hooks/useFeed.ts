import { useState, useEffect } from 'react';
import useUserContext from './useUserContext';
import { FeedPost } from '../types';
import { getFeed } from '../services/userService';

const useFeed = (initialType?: string) => {
  const { user } = useUserContext();

  const [feedItems, setFeedItems] = useState<FeedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedItemType, setFeedItemType] = useState<string | undefined>(initialType);

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
      }
    };

    fetchData();
  }, [user.username, feedItemType]);

  return {
    feedItems,
    error,
    setFeedItemType,
  };
};

export default useFeed;
