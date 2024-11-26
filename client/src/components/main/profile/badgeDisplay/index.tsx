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
    badgeContainer: 'flex justify-between px-4 flex-col w-full',
    badgeDialogContainer: 'flex flex-col mb-5',
    badgeCardContainer: 'flex flex-col md:flex-row w-full',
    badgeCard: 'border border-gray-300 rounded-lg p-5 mb-6 mr-2 md:ml-2 w-full',
    badgeIcon: 'text-5xl pr-4 mt-1',
    badgeInv: 'mt-5 relative inline-block mr-4 group',
    tooltip:
      'bg-gray-800 text-white text-center rounded p-1.5 absolute top-[120%] w-48 opacity-0 transition-opacity duration-300 pointer-events-none z-50 group-hover:opacity-100',
    badgeText: 'flex flex-row',
    font: 'text-2xl font-bold',
    badgeType: 'badge flex flex-row border p-2 rounded-md',
    badgeIconMini: 'mt-1 mr-2',
  };

  const userBadges = BADGES.filter(badge => userBadgeNames.includes(badge.name));

  const goldBadges = userBadges.filter(badge => badge.color === 'gold');
  const silverBadges = userBadges.filter(badge => badge.color === 'silver');
  const bronzeBadges = userBadges.filter(badge => badge.color === 'bronze');
  return (
    <div className={styles.badgeContainer}>
      <div className={styles.badgeDialogContainer}>
        <Dialog onClose={() => onClose()} open={open} className='mt-1'>
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
                      secondary={badge.description}
                    />
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        </Dialog>
      </div>
      <div className={styles.badgeCardContainer}>
        {/* Gold Badges */}
        <div className={styles.badgeCard}>
          <div className={styles.badgeText}>
            <div className={`${styles.badgeIcon} gold`}>
              <FaCircle />
            </div>
            <div>
              <h3>
                <span className={styles.font}>{goldBadges.length}</span>
                <br></br>gold badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'gold').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className={styles.badgeInv} key={badge._id}>
                  <span className={`${styles.badgeType} ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`${styles.badgeIconMini} gold`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className={styles.tooltip}>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.badgeCard}>
          <div className={styles.badgeText}>
            <div className={`${styles.badgeIcon} silver`}>
              <FaCircle />
            </div>
            <div>
              <h3>
                <span className={styles.font}>{silverBadges.length}</span>
                <br></br>silver badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'silver').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className={styles.badgeInv} key={badge._id}>
                  <span className={`${styles.badgeType} ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`${styles.badgeIconMini} silver`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className={styles.tooltip}>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.badgeCard}>
          <div className={styles.badgeText}>
            <div className={`${styles.badgeIcon} bronze`}>
              <FaCircle />
            </div>
            <div>
              <h3>
                <span className={styles.font}>{bronzeBadges.length}</span>
                <br></br>bronze badges
              </h3>
            </div>
          </div>
          <div>
            {BADGES.filter(badge => badge.color === 'bronze').map(badge => {
              const isEarned = userBadges.includes(badge);
              return (
                <div className={styles.badgeInv} key={badge._id}>
                  <span className={`${styles.badgeType} ${isEarned ? '' : 'greyed-out'}`}>
                    <span className={`${styles.badgeIconMini} bronze`}>
                      <FaCircle />
                    </span>
                    {badge.name.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className={styles.tooltip}>{badge.description}</div>
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
