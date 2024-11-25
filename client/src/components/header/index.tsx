import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { IoHomeSharp } from 'react-icons/io5';
import { MdFeed } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { User } from '../../types';
import HeaderMenu from './menu';
import Logo from './images/logo.png';
import useNotifications from '../../hooks/useNotifications';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Header = ({ user }: { user: User | null }) => {
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setAnchorEl(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id='header' className='header'>
      {/* Logo Section */}
      <Link to={'/'}>
        <div className='logo-title flex align-middle'>
          <img className='mr-2 flex' width='50' src={Logo} alt='Logo' />
          <div className='text-[24px] leading-6 mb-3 font-bold mt-5'>Stack Overgram</div>
        </div>
      </Link>

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
                    onClick={handlePopoverClose}>
                    {link.name === 'Notifications' && (
                      <div className='header-element'>
                        <Badge badgeContent={unseenNotificationCount || 0} color='primary'>
                          <span className='icon'>{link.image}</span>
                        </Badge>
                        <span className='text'>{link.name}</span>
                      </div>
                    )}
                    {link.name !== 'Notifications' && (
                      <div className='header-element'>
                        <span className='icon'>{link.image}</span>
                        <span className='text'>{link.name}</span>
                      </div>
                    )}
                  </Link>
                ) : (
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
        <div className='right-side-header flex lg:w-4/12'>
          {links.map((link, index) =>
            link.name !== 'Me' ? (
              <Link
                key={index}
                to={`/${link.route}`}
                className={`link ${pathname === `/${link.route}` ? 'active' : ''}`}>
                {link.name === 'Notifications' && (
                  <div className='header-element'>
                    <Badge badgeContent={unseenNotificationCount || 0} color='primary'>
                      <span className='icon'>{link.image}</span>
                    </Badge>
                    <span className='text'>{link.name}</span>
                  </div>
                )}
                {link.name !== 'Notifications' && (
                  <div className='header-element'>
                    <span className='icon'>{link.image}</span>
                    <span className='text'>{link.name}</span>
                  </div>
                )}
              </Link>
            ) : (
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
