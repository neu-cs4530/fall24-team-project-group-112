import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { IoHomeSharp } from 'react-icons/io5';
import { MdFeed } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import useHeader from '../../hooks/useHeader';
import { User } from '../../types';
import HeaderMenu from './menu';
import Logo from './images/logo.png';
import useNotifications from '../../hooks/useNotifications';

const Header = ({ user }: { user: User | null }) => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const { unseenNotificationCount } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for popover
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024); // Track screen size

  const links = [
    { name: 'Home', route: 'home', image: <IoHomeSharp /> },
    { name: 'Feed', route: 'feed', image: <MdFeed /> },
    { name: 'Notifications', route: 'notification', image: <FaBell /> },
    { name: 'Me' },
  ];

  const { pathname } = useLocation();

  const isQuestionPage = pathname === '/home' || pathname.startsWith('/question');

  // Open popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  // Update screen size state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setAnchorEl(null); // Close popover when switching to large screen
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id='header' className='header'>
      {/* Logo Section */}
      <div className='logo-title flex flex-row align-middle'>
        <img className='mr-2 flex' width='50' src={Logo} alt='Logo' />
        <div className='text-[24px] flex font-bold w-8/12 mt-5'>Stack Overgram</div>
      </div>

      {/* Search Bar */}
      {isQuestionPage && (
        <input
          id='searchBar'
          className='px-4 mr-24 py-2 rounded-lg search-bar border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500'
          placeholder='Search for a question...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      )}

      {isSmallScreen ? (
        <>
          <Button
            variant='contained'
            onClick={handlePopoverOpen}
            className='hamburger'
            aria-label='Toggle navigation menu'>
            ☰
          </Button>

          <Popover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
            <div className='popover-menu p-4'>
              {links.map((link, index) =>
                link.name !== 'Me' ? (
                  <Link
                    key={index}
                    to={`/${link.route}`}
                    className={`link ${pathname === `/${link.route}` ? 'active' : ''}`}
                    onClick={handlePopoverClose} // Close popover after clicking a link
                  >
                    {/* Notifications Badge */}
                    {link.name === 'Notifications' && (
                      <div className='header-element'>
                        <Badge badgeContent={unseenNotificationCount || 0} color='primary'>
                          <span className='icon'>{link.image}</span>
                        </Badge>
                        <span className='text'>{link.name}</span>
                      </div>
                    )}
                    {/* Other Links */}
                    {link.name !== 'Notifications' && (
                      <div className='header-element'>
                        <span className='icon'>{link.image}</span>
                        <span className='text'>{link.name}</span>
                      </div>
                    )}
                  </Link>
                ) : (
                  // "Me" Menu
                  <div key={index} className='header-element'>
                    <HeaderMenu key={index} user={user} text={link.name} />
                  </div>
                ),
              )}
            </div>
          </Popover>
        </>
      ) : (
        // Right-Side Header (Visible on Large Screens)
        <div className='right-side-header flex lg:w-6/12'>
          {links.map((link, index) =>
            link.name !== 'Me' ? (
              <Link
                key={index}
                to={`/${link.route}`}
                className={`link ${pathname === `/${link.route}` ? 'active' : ''}`}>
                {/* Notifications Badge */}
                {link.name === 'Notifications' && (
                  <div className='header-element'>
                    <Badge badgeContent={unseenNotificationCount || 0} color='primary'>
                      <span className='icon'>{link.image}</span>
                    </Badge>
                    <span className='text'>{link.name}</span>
                  </div>
                )}
                {/* Other Links */}
                {link.name !== 'Notifications' && (
                  <div className='header-element'>
                    <span className='icon'>{link.image}</span>
                    <span className='text'>{link.name}</span>
                  </div>
                )}
              </Link>
            ) : (
              // "Me" Menu
              <div key={index} className='header-element'>
                <HeaderMenu key={index} user={user} text={link.name} />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
