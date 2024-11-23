import { Link, useLocation } from 'react-router-dom';
import './index.css';
import Badge from '@mui/material/Badge';
import { IoHomeSharp } from 'react-icons/io5';
import { MdFeed } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import useHeader from '../../hooks/useHeader';
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
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const { unseenNotificationCount } = useNotifications();

  const links = [
    { name: 'Home', route: 'home', image: <IoHomeSharp /> },
    { name: 'Feed', route: 'feed', image: <MdFeed /> },
    { name: 'Notifications', route: 'notification', image: <FaBell /> },
    { name: 'Me' },
  ];

  const { pathname } = useLocation();

  const isQuestionPage = pathname === '/home' || pathname.startsWith('/question');

  return (
    <div id='header' className='header'>
      <div className='logo-title flex flex-row align-middle'>
        <img className='mr-2 flex' width='50' src={Logo} alt='Logo' />
        <div className='text-[24px] flex font-bold w-8/12 mt-5'>Stack Overgram</div>
      </div>
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
      <div className='right-side-header  w-6/12'>
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
    </div>
  );
};
export default Header;
