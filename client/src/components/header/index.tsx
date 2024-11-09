import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import './index.css';
import { IoHomeSharp } from 'react-icons/io5';
import { MdFeed } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import useHeader from '../../hooks/useHeader';
import useLocalStorage from '../../hooks/useLocalStorage';
/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  // TODO: can we do this more cleanly using UserContext?
  const { getItem } = useLocalStorage();
  const user = getItem('user');
  const username = user ? JSON.parse(user).username : '';

  const links = [
    { name: 'Home', route: 'home', image: <IoHomeSharp /> },
    { name: 'Feed', route: 'feed', image: <MdFeed /> },
    { name: 'Notifications', route: 'notifications', image: <FaBell /> },
    { name: 'Me', route: username ? `profile/${username}` : '', image: <IoMdPerson /> },
  ];

  const { pathname } = useLocation();

  return (
    <div id='header' className='header'>
      <div className='left-side-header'>
        <div className='title'>Fake Stack Overflow</div>
        <input
          id='searchBar'
          placeholder='Search ...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className='right-side-header'>
        {links.map((link, index) => (
          <Link
            key={index}
            to={`/${link.route}`}
            className={`link ${pathname === `/${link.route}` ? 'active' : ''}`}>
            <div className='header-element'>
              <span className='icon'>{link.image}</span>
              <span className='text'>{link.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
