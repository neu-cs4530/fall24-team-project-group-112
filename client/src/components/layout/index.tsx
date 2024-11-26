import './index.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header';
import { User } from '../../types';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Layout = ({ user }: { user: User | null }) => {
  const location = useLocation();

  // Check if the current path is '/notifications'
  const isNotificationsPage = location.pathname === '/notification';

  // Check if the current path is '/feed'
  const isFeedPage = location.pathname === '/feed';

  // Check if the current path is '/profile'
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <>
      <Header user={user} />
      <div id='main' className='main'>
        <div
          id='right_main'
          className={!isNotificationsPage || !isFeedPage || !isProfilePage ? 'right_main' : ''}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
