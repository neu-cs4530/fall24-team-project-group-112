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

  const styles = {
    loadingContainer: 'flex justify-center items-center h-screen',
    notificationDiv: 'notification-div relative items-center px-2',
    notificationTitle: 'notification-title mt-10 mb-5 lg:mb-10 font-bold text-4xl',
    filterContainer:
      'lg:absolute lg:top-0 lg:right-0 flex flex-col-reverse sm:flex-row-reverse lg:flex-col items-start lg:items-end lg:w-[25%]',
    filterWrapper: 'mt-3 sm:mt-0 lg:my-6 px-2',
    recommendationsWrapper: 'w-full px-2 ',
    feedContainer: 'flex flex-col items-center mt-3',
    noNotifications: 'no-notifications',
  };

  return (
    <>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <div className={styles.notificationDiv}>
          <h2 className={styles.notificationTitle}>Feed</h2>
          <div className={styles.filterContainer}>
            <div className={styles.filterWrapper}>
              <FeedFilter onFilterChange={handleFilterChange} />
            </div>
            <div className={styles.recommendationsWrapper}>
              <FollowerRecommendations />
            </div>
          </div>
          <div className={styles.feedContainer}>
            {!feedItems.length && (
              <div className={styles.noNotifications}>You are up to date on recent activity!</div>
            )}
            {feedItems.length > 0 && <FeedList feedItems={feedItems} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
