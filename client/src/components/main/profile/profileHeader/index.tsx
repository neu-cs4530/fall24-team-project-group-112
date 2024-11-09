import { useState } from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
import FollowDisplay from '../followDisplay';
import './index.css';

/**
 * Interface representing the props for the Header component.
 *
 * - user: The user object that contains the user's information.
 */
interface ProfileHeaderProps {
  user: User;
}

const USERNAMES = ['ro', 'neetidesai', 'aarohi'];

/**
 * Profile header component that displays the users "header" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, and profile headline.
 *
 * @param user `User` object that contains the user's information.
 *
 * @returns A React component that displays the user's header information.
 */
const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  return (
    <div className='profile-header'>
      <Avatar avatarName={user.avatarName || 'avatar1'} />
      <div className='text-container'>
        <div className='name-username-container'>
          <div className='name'>{`${user.firstName} ${user.lastName}`}</div>
          <div className='username'>{`@${user.username}`}</div>
        </div>
        <div className='headline-container'>{user.headline && <div>{user.headline}</div>}</div>
        <div className='info-container'>
          {user.githubUrl && (
            <div className='profile-header-github'>
              <a href={user.githubUrl} target='_blank' rel='noreferrer'>
                <FaGithub className='icon' />
                github
              </a>
            </div>
          )}
          {user.school && (
            <div className='profile-header-school'>
              <FaSchool className='icon' /> {user.school}
            </div>
          )}
          {user.city && user.state && (
            <div className='profile-header-location'>
              <FaMapMarkerAlt className='icon' /> {`${user.city}, ${user.state}`}
            </div>
          )}
          {user.company && (
            <div className='profile-header-company'>
              <MdWork className='icon' />
              {user.company}
            </div>
          )}
        </div>
        {user.headline && <div className='profile-header-headline'></div>}
        <div className='profile-follows'>
          <div>
            <p onClick={() => setFollowersOpen(true)}>
              <span className='profile-follower-count'>{USERNAMES.length}</span> followers
            </p>
            <FollowDisplay
              usernames={USERNAMES}
              open={followersOpen}
              onClose={() => setFollowersOpen(false)}
              type={'Followers'}
            />
          </div>
          <div>
            <p onClick={() => setFollowingOpen(true)}>
              <span className='profile-follower-count'>{USERNAMES.length}</span> following
            </p>
            <FollowDisplay
              usernames={USERNAMES}
              open={followingOpen}
              onClose={() => setFollowingOpen(false)}
              type={'Following'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
