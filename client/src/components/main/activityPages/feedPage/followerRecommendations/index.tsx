import React from 'react';
import FollowChip from './followChip';
import useFollowerRecommendations from '../../../../../hooks/useFollowerRecommendations';

interface FollowerRecommendationsProps {}

const FollowerRecommendations: React.FC<FollowerRecommendationsProps> = () => {
  const { recommendations } = useFollowerRecommendations();

  return (
    recommendations &&
    recommendations.length > 0 && (
      <div className='w-[300px] border border-black rounded-lg p-4'>
        <h2 className='font-bold text-lg mb-2'>Follow Recommendations</h2>
        <div className='flex flex-col gap-2'>
          {recommendations.map((recommendation, index) => (
            <FollowChip
              key={index}
              followeeUsername={recommendation.username}
              followeeName={`${recommendation.firstName} ${recommendation.lastName}`}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default FollowerRecommendations;
