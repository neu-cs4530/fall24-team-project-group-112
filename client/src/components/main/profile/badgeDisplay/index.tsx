import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { User } from '../../../../types';
import './index.css';

const BADGES = [
  {
    _id: '673425329c00935604e19ea6',
    name: 'AUTOBIOGRAPHER',
    description: 'You have completed every section of your profile details!',
    color: 'bronze',
  },
  {
    _id: '673425329c00935604e19ea7',
    name: 'VOTER',
    description: 'You have cast your first upvote or downvote!',
    color: 'bronze',
  },
  {
    _id: '673425329c00935604e19ea8',
    name: 'SPEEDY_ANSWERER',
    description: 'You have answered a question within 30 minutes of it being asked!',
    color: 'silver',
  },
  {
    _id: '673425329c00935604e19ea9',
    name: 'COMMUNITY_HELPER',
    description: 'You have answered 10 different questions within a week!',
    color: 'silver',
  },
  {
    _id: '673425329c00935604e19eaa',
    name: 'TOP_ANSWERER',
    description: 'You have answered over 20 questions!',
    color: 'gold',
  },
  {
    _id: '673425329c00935604e19eab',
    name: 'LIFESAVER',
    description:
      'You have asked a question that is upvoted more than 50 times within a week of posting!',
    color: 'gold',
  },
];

interface BadgeDisplayProps {
  user: User;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ user }) => {
  const userBadgeNames = user.badges.map(
    badgeId => BADGES.find(badge => badge._id?.toString() === badgeId.toString())?.name,
  );

  const userBadges = BADGES.filter(badge => userBadgeNames.includes(badge.name));

  const goldBadges = userBadges.filter(badge => badge.color === 'gold');
  const silverBadges = userBadges.filter(badge => badge.color === 'silver');
  const bronzeBadges = userBadges.filter(badge => badge.color === 'bronze');
  return (
    <div className='badge-container'>
      {user.badges.length > 0 && <h2 className='badge-title font-bold text-xl'>Badges</h2>}
      <div className='flex flex-row'>
        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon gold'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{goldBadges.length}</span> <br></br>gold badges
              </h3>
            </div>
          </div>
          <div>
            {goldBadges.map(badge => (
              <div className='mt-5 badge-inv' key={badge._id}>
                <span className='badge flex flex-row border p-2 rounded-md'>
                  <span className='mt-1 mr-2 gold'>
                    <FaCircle />
                  </span>
                  {badge.name.replace(/_/g, ' ').toLowerCase()}
                </span>
                <div className='tooltip'>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon silver'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{silverBadges.length}</span> <br></br>silver
                badges
              </h3>
            </div>
          </div>
          <div>
            {silverBadges.map(badge => (
              <div className='mt-5 badge-inv' key={badge._id}>
                <span className='badge flex flex-row border p-2 rounded-md'>
                  <span className='mt-1 mr-2 silver'>
                    <FaCircle />
                  </span>
                  {badge.name.replace(/_/g, ' ').toLowerCase()}
                </span>
                <div className='tooltip'>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon bronze'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{bronzeBadges.length}</span> <br></br>bronze
                badges
              </h3>
            </div>
          </div>
          <div>
            {bronzeBadges.map(badge => (
              <div className='mt-5 badge-inv' key={badge._id}>
                <span className='badge flex flex-row border p-2 rounded-md'>
                  <span className='mt-1 mr-2 bronze'>
                    <FaCircle />
                  </span>
                  {badge.name.replace(/_/g, ' ').toLowerCase()}
                </span>
                <div className='tooltip'>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
