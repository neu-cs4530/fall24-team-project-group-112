import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import './index.css';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
/**
 * Interface representing the props for the Header component.
 *
 * - user: The user object that contains the user's information.
 */
interface ProfileHeaderProps {
  user: User;
}

/**
 * Profile header component that displays the users "header" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, and profile headline.
 *
 * @param user `User` object that contains the user's information.
 *
 * @returns A React component that displays the user's header information.
 */
const ProfileHeader = ({ user }: ProfileHeaderProps) => (
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
    </div>
  </div>
);

export default ProfileHeader;
