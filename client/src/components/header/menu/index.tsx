import * as React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { IoMdPerson } from 'react-icons/io';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { User } from '../../../types';
import Avatar from '../../main/baseComponents/avatar';
import { logoutUser } from '../../../services/userService';

/**
 * HeaderMenu component displays the menu options for the user to navigate to different pages.
 *
 * @param user The user object containing the logged in user's information.
 */
export default function HeaderMenu({ user }: { user: User | null }) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };

  const handleLogout = async (user: User) => {
    try {
      const res = await logoutUser(user.email);
      localStorage.removeItem('user');
      setAnchor(null);

      if ('status' in res) {
        setError(res.error);
      }
    } catch (error: unknown) {
      return {
        status: 500,
        error: 'An unexpected error occurred',
      };
    }
  };

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
        {user !== null ? (
          <Avatar avatarName={user.avatarName} width={30} height={30} circular={true} />
        ) : (
          <IoMdPerson />
        )}
      </Button>
      <Menu id='basic-menu' anchorEl={anchor} open={open} onClose={handleClose} className='*'>
        <MenuItem
          component={Link}
          className='*'
          to={user ? `profile/${user.username}` : 'login'}
          onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} to={'login'} onClick={handleLogout} className='*'>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
