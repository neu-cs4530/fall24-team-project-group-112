import React from 'react';
import { FeedPost } from '../../../../../types';
import FeedItem from '../feedItem';

interface FeedListProps {
  feedItems: FeedPost[];
}

const FeedList: React.FC<FeedListProps> = ({ feedItems }) => (
  <ul className='w-full items-center'>
    {feedItems.slice().map((item, idx) => (
      <FeedItem key={idx} feedItem={item} />
    ))}
  </ul>
);

export default FeedList;
