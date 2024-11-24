import React from 'react';
import { Dialog, List, ListItem, ListItemText } from '@mui/material';
import { FaCircle } from 'react-icons/fa';
import { User } from '../../../../types';
import './index.css';

const BADGES = [
  {
    _id: '673425329c00935604e19ea6',
    name: 'AUTOBIOGRAPHER',
    description: 'Complete every section of your profile details!',
    color: 'bronze',
  },
  {
    _id: '673425329c00935604e19ea7',
    name: 'VOTER',
    description: 'Cast your first upvote or downvote!',
    color: 'bronze',
  },
  {
    _id: '673425329c00935604e19ea8',
    name: 'SPEEDY_ANSWERER',
    description: 'Answer a question within 30 minutes of it being asked!',
    color: 'silver',
  },
  {
    _id: '673425329c00935604e19ea9',
    name: 'COMMUNITY_HELPER',
    description: 'Answer 10 different questions within a week!',
    color: 'silver',
  },
  {
    _id: '673425329c00935604e19eaa',
    name: 'TOP_ANSWERER',
    description: 'Answer over 20 questions!',
    color: 'gold',
  },
  {
    _id: '673425329c00935604e19eab',
    name: 'LIFESAVER',
    description: 'Ask a question that is upvoted more than 50 times within a week of posting!',
    color: 'gold',
  },
];

const toSentenceCase = (title: string) =>
  title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

const adjustDescription = (description: string) => {
  const words = description.split(' ');
  return words.length > 2
    ? words.slice(2).join(' ').charAt(0).toUpperCase() + words.slice(2).join(' ').slice(1)
    : description;
};

interface BadgeDisplayProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ user, open, onClose }) => {
  const userBadgeNames = user.badges.map(
    badgeId => BADGES.find(badge => badge._id?.toString() === badgeId.toString())?.name,
  );

  const styles = {
    dialogContainer: 'w-[500px]',
    title: 'pl-5 pt-5 text-xl font-bold',
    userInfoContainer: 'flex-col ml-2 mt-2',
    badgeIconContainer: 'mr-2 mt-1 ml-4',
    badgeTextContainer: 'mr-4',
  };

  const userBadges = BADGES.filter(badge => userBadgeNames.includes(badge.name));

  const goldBadges = userBadges.filter(badge => badge.color === 'gold');
  const silverBadges = userBadges.filter(badge => badge.color === 'silver');
  const bronzeBadges = userBadges.filter(badge => badge.color === 'bronze');
  return (
    <div className='badge-container'>
      <div className='flex flex-col badge-title'>
        <Dialog onClose={() => onClose()} open={open} className='view-badges'>
          <div className={styles.dialogContainer}>
            <List sx={{ pt: 1, pb: 2 }}>
              <p className={styles.title}>All Badges:</p>
              {BADGES.map((badge, idx) => (
                <ListItem disableGutters key={idx}>
                  <div className={styles.badgeIconContainer}>
                    <FaCircle className={badge.color} />
                  </div>
                  <div className={styles.userInfoContainer}>
                    <ListItemText
                      className={styles.badgeTextContainer}
                      primary={`${toSentenceCase(badge.name.replace(/_/g, ' '))}`}
                      secondary={adjustDescription(badge.description)}
                    />
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        </Dialog>
      </div>
      <div className='flex flex-col md:flex-row w-full md:w-full'>
        {/* Gold Badges */}
        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon gold'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{goldBadges.length}</span>
                <br></br>gold badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'gold').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className='mt-5 badge-inv' key={badge._id}>
                  <span
                    className={`badge flex flex-row border p-2 rounded-md ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`mt-1 mr-2 gold`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className='tooltip'>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon silver'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{silverBadges.length}</span>
                <br></br>silver badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'silver').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className='mt-5 badge-inv' key={badge._id}>
                  <span
                    className={`badge flex flex-row border p-2 rounded-md ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`mt-1 mr-2 silver`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className='tooltip'>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='badge-card'>
          <div className='flex flex-row'>
            <div className='badge-icon bronze'>
              <FaCircle />
            </div>
            <div className='badge-info'>
              <h3>
                <span className='text-2xl font-bold'>{bronzeBadges.length}</span>
                <br></br>bronze badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'bronze').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className='mt-5 badge-inv' key={badge._id}>
                  <span
                    className={`badge flex flex-row border p-2 rounded-md ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`mt-1 mr-2 bronze`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className='tooltip'>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
