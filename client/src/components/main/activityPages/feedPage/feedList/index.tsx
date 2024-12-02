import React from 'react';
import { FeedPost } from '../../../../../types';
import FeedItem from '../feedItem';

/**
 * FeedListProps is an interface for the FeedList component props.
 *
 * @param {FeedPost[]} feedItems - The feed items.
 */
interface FeedListProps {
  feedItems: FeedPost[];
}

/**
 * FeedList component displays a list of feed items.
 *
 * @param {FeedPost[]} feedItems - The feed items.
 */
const FeedList: React.FC<FeedListProps> = ({ feedItems }) => (
  <ul>
    {feedItems.slice().map((item, idx) => (
      <FeedItem key={idx} feedItem={item} />
    ))}
  </ul>
);

export default FeedList;
