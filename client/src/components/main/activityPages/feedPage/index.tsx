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
        <div className='notification-div relative items-center'>
          <h2 className='notification-title font-bold text-4xl'>Feed</h2>
          {/* <div className='md:absolute md:top-0 md:right-0 pr-4 flex flex-col-reverse md:flex-col items-center md:items-end w-full md:w-auto'>
            <div className='my-6 ml-4 px-2 md:max-w-xs  md:mt-0'>
              <FeedFilter onFilterChange={handleFilterChange} />
            </div>
            <div className='w-full ml-2 px-2 md:px-0 md:max-w-xs md:mt-6 mx-auto'>
              <FollowerRecommendations />
            </div>
          </div> */}
          <div className='flex flex-col items-center'>
            {!feedItems.length && (
              <div className='no-notifications'>You are up to date on recent activity!</div>
            )}
            {feedItems.length > 0 && <FeedList feedItems={feedItems} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
