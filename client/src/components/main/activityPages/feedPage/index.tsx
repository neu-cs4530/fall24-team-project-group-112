import React from 'react';
import { CircularProgress } from '@mui/material';
import FeedList from './feedList';
import FeedFilter from './filterComponent';
import useFeed from '../../../../hooks/useFeed';
import FollowerRecommendations from './followerRecommendations';

const Feed: React.FC = () => {
  const { feedItems, error, setFeedItemType, isLoading } = useFeed();

  const handleFilterChange = (type: string) => {
    setFeedItemType(type);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <div className='notification-div relative'>
          <h2 className='notification-title font-bold text-4xl'>Feed</h2>
          <div className='absolute top-0 right-0 pr-4 flex flex-col items-end'>
            <div className='mb-5 max-w-xs'>
              <FeedFilter onFilterChange={handleFilterChange} />
            </div>
            <div className='w-full max-w-xs mt-6'>
              <FollowerRecommendations />
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
      )}
    </>
  );
};

export default Feed;
