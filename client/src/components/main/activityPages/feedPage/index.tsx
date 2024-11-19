import React from 'react';
import FeedList from './feedList';
import FeedFilter from './filterComponent';
import useFeed from '../../../../hooks/useFeed';

const Feed: React.FC = () => {
  const { feedItems, error, setFeedItemType } = useFeed();

  const handleFilterChange = (type: string) => {
    setFeedItemType(type);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='notification-div relative'>
      <h2 className='notification-title font-bold text-4xl'>Feed</h2>
      <div className='absolute top-0 right-0 pr-4'>
        <div className='mb-5'>
          <FeedFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col items-center'>
          {!feedItems.length && (
            <div className='no-notifications'>You are up to date on recent activity!</div>
          )}
          {feedItems.length > 0 && <FeedList feedItems={feedItems} />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
