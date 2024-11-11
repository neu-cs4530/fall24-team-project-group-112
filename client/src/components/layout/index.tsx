import React from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';
import { User } from '../../types';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 *
 * @param user The user object containing the logged in user's information, or null if a user is not logged in.
 */
const Layout = ({ user }: { user: User | null }) => (
  <>
    <Header user={user} />
    <div id='main' className='main'>
      <SideBarNav />
      <div id='right_main' className='right_main'>
        <Outlet />
      </div>
    </div>
  </>
);

export default Layout;
