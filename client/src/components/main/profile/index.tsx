import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import Header from './header';
import { getUser } from '../../../services/userService';
import { User } from '../../../types';
import useProfile from '../../../hooks/useProfile';

/**
 * Profile Component displays the full content on a user's profile page. It also includes functionality for a user to edit the information on their own profile page.
 */
const Profile = () => {
  const { user, setUser, error } = useProfile();

  if (error) {
    return (
      <div className='container'>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className='container'>
      {user ? (
        <Header
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
          github={user.githubUrl}
          school={user.school}
          city={user.city}
          state={user.state}
          company={user.company}
          headline={user.headline}
        />
      ) : null}
    </div>
  );
};

export default Profile;
