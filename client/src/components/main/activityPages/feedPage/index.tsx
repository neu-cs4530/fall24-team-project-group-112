import React from 'react';
import FeedFilter from './filterComponent';
import './index.css';
import useFeed from '../../../../hooks/useFeed';
import FeedList from './feedList';

const Feed: React.FC = () => {
  const { feedItems, error, setFeedItemType } = useFeed();

  const handleFilterChange = (type: string) => {
    setFeedItemType(type);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='notification-div'>
      <h2 className='notification-title font-bold text-4xl'>Feed</h2>

      <div className='mb-5'>
        <FeedFilter onFilterChange={handleFilterChange} />
      </div>

      {!feedItems.length && (
        <div className='no-notifications'>You are up to date on recent activity!</div>
      )}

      {feedItems.length > 0 && <FeedList feedItems={feedItems} />}
    </div>
  );
};

export default Feed;
