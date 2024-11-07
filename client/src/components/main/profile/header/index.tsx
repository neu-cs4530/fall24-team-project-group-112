import React from 'react';
import './index.css';
import { User } from '../../../../types';

/**
 * Interface representing the props for the Header component.
 *
 * - firstname The first name of the user.
 * - lastname The last name of the user.
 * - username The username of the user.
 * - github? The github link of the user. This is optional.
 * - school? The school of the user. This is optional.
 * - headline? The profile headline of the user. This is optional.
 * - city? The city of the user. This is optional.
 * - state? The state of the user. This is optional.
 * - company? The company of the user. This is optional.
 */
interface HeaderProps {
  firstName: string;
  lastName: string;
  username: string;
  github?: string;
  school?: string;
  headline?: string;
  city?: string;
  state?: string;
  company?: string;
}

/**
 * Header component that displays the users "header" information - their username, first name and last name,
 * and optional information - their github link, school, city, state, company, and profile headline.
 *
 * @param firstName The first name of the user.
 * @param lastName The last name of the user.
 * @param username The username of the user.
 * @param github The github link of the user.
 * @param school The school of the user.
 * @param headline The profile headline of the user.
 * @param city The city of the user.
 * @param state The state of the user.
 * @param company The company of the user.
 *
 * @returns A React component that displays the user's header information.
 */
const Header = ({
  firstName,
  lastName,
  username,
  github,
  school,
  headline,
  city,
  state,
  company,
}: HeaderProps) => (
  <div className=''>
    <div className='header'>
      <div className='headerName'>{`${firstName} ${lastName}`}</div>
      <div className='headerUsername'>{username}</div>
      {github && (
        <div className='headerGithub'>
          <a href={github} target='_blank' rel='noreferrer'>
            {github}
          </a>
        </div>
      )}
      {school && <div className='headerSchool'>{school}</div>}
      {city && state && <div className='headerLocation'>{`${city}, ${state}`}</div>}
      {company && <div className='headerCompany'>{company}</div>}
      {headline && <div className='headerHeadline'>{headline}</div>}
    </div>
  </div>
);

export default Header;
