import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import './index.css';
import { User } from '../../../../types';
import Avatar from '../../baseComponents/avatar';
/**
 * Interface representing the props for the ProfileTextProps component.
 *
 * - user: The user object that contains the user's information.
 * - loggedInUser: The logged in user object that contains the logged in user's information, or null if a user is not logged in.
 */
interface ProfileTextProps {
  user: User;
  loggedInUser: User | null;
}

/**
 * Profile text component that displays the user's editable "text" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, profile headline, and bio.
 *
 * @param user `User` object that contains the user's information.
 *
 * @returns A React component that displays the user's text information.
 */
const ProfileText = ({ user, loggedInUser }: ProfileTextProps) => (
  <div className='profile-text'>
    <div className='profile-text-header'>
      <Avatar avatarName={user.avatarName || 'avatar1'} />
      <div className='text-container'>
        <div className='name-username-container'>
          <div className='name'>{`${user.firstName} ${user.lastName}`}</div>
          <div className='username'>{`@${user.username}`}</div>

          {loggedInUser && loggedInUser.username === user.username && (
            <div className='edit-profile-button'>
              <button>Edit Profile</button>
            </div>
          )}
        </div>

        <div className='headline-container'>{user.headline && <div>{user.headline}</div>}</div>

        <div className='info-container'>
          {user.githubUrl && (
            <div className='profile-text-github'>
              <a href={user.githubUrl} target='_blank' rel='noreferrer'>
                <FaGithub className='icon' />
                github
              </a>
            </div>
          )}
          {user.school && (
            <div className='profile-text-school'>
              <FaSchool className='icon' /> {user.school}
            </div>
          )}
          {user.city && user.state && (
            <div className='profile-text-location'>
              <FaMapMarkerAlt className='icon' /> {`${user.city}, ${user.state}`}
            </div>
          )}
          {user.company && (
            <div className='profile-text-company'>
              <MdWork className='icon' />
              {user.company}
            </div>
          )}
        </div>
        {user.headline && <div className='profile-text-headline'></div>}
      </div>
    </div>
    {user.bio && (
      <div className='profile-bio'>
        <div className='bio-header'>Bio</div>
        <div className='bio-content'>{user.bio}</div>
      </div>
    )}
  </div>
);

export default ProfileText;
