import React from 'react';
import useFollowerRecommendations from '../../../../../hooks/useFollowerRecommendations';
import FollowChip from './followChip';

interface FollowerRecommendationsProps {}

const FollowerRecommendations: React.FC<FollowerRecommendationsProps> = () => {
  const { recommendations } = useFollowerRecommendations();

  return (
    recommendations &&
    recommendations.length > 0 && (
      <div className='w-full border border-black rounded-lg'>
        <h2 className='font-bold text-lg bg-gray-200 px-4 py-2 rounded-lg'>
          Follow Recommendations
        </h2>
        <div className='flex flex-col gap-2 p-2'>
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
