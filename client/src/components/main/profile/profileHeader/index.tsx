import React from 'react';
import { FaGithub, FaSchool, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import './index.css';
import Avatar from '../../baseComponents/avatar';
/**
 * Interface representing the props for the Header component.
 *
 * - firstname The first name of the user.
 * - lastname The last name of the user.
 * - username The username of the user.
 * - avatarName The name of the user's avatar image.
 * - github? The github link of the user. This is optional.
 * - school? The school of the user. This is optional.
 * - headline? The profile headline of the user. This is optional.
 * - city? The city of the user. This is optional.
 * - state? The state of the user. This is optional.
 * - company? The company of the user. This is optional.
 */
interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  username: string;
  avatarName: string;
  github?: string;
  school?: string;
  headline?: string;
  city?: string;
  state?: string;
  company?: string;
}

/**
 * Profile header component that displays the users "header" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, and profile headline.
 *
 * @param firstName The first name of the user.
 * @param lastName The last name of the user.
 * @param username The username of the user.
 * @param avatarName The name of the user's avatar image.
 * @param github The github link of the user.
 * @param school The school of the user.
 * @param headline The profile headline of the user.
 * @param city The city of the user.
 * @param state The state of the user.
 * @param company The company of the user.
 *
 * @returns A React component that displays the user's header information.
 */
const ProfileHeader = ({
  firstName,
  lastName,
  username,
  avatarName,
  github,
  school,
  headline,
  city,
  state,
  company,
}: ProfileHeaderProps) => (
  <div className='profile-header'>
    <Avatar avatarName={avatarName} />
    <div className='text-container'>
      <div className='name-username-container'>
        <div className='name'>{`${firstName} ${lastName}`}</div>
        <div className='username'>{`@${username}`}</div>
      </div>

      <div className='headline-container'>{headline && <div>{headline}</div>}</div>

      <div className='info-container'>
        {github && (
          <div className='profile-header-github'>
            <a href={github} target='_blank' rel='noreferrer'>
              <FaGithub className='icon' />
              github
            </a>
          </div>
        )}
        {school && (
          <div className='profile-header-school'>
            <FaSchool className='icon' /> {school}
          </div>
        )}
        {city && state && (
          <div className='profile-header-location'>
            <FaMapMarkerAlt className='icon' /> {`${city}, ${state}`}
          </div>
        )}
        {company && (
          <div className='profile-header-company'>
            <MdWork className='icon' />
            {company}
          </div>
        )}
      </div>
      {headline && <div className='profile-header-headline'></div>}
    </div>
  </div>
);

export default ProfileHeader;
