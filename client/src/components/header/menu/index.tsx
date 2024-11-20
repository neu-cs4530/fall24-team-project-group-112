import * as React from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdPerson } from 'react-icons/io';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { Alert, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import { User } from '../../../types';
import Avatar from '../../main/baseComponents/avatar';
import { logoutUser } from '../../../services/userService';
import useUser from '../../../hooks/useUser';

/**
 * HeaderMenu component displays the menu options for the user to navigate to different pages.
 *
 * @param user The user object containing the logged in user's information.
 * @param text The text to display for the menu.
 */
export default function HeaderMenu({ user, text }: { user: User | null; text: string }) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const open = Boolean(anchor);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };

  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if ('status' in res) {
        setError(res.error);
      } else {
        // if logout successful remove user from local storage and set user to null
        await localStorage.removeItem('user');
        setUser(null);
        setAnchor(null);
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err as string);
    }
  };

  return (
    <div>
      {error && (
        <Dialog open={Boolean(error)} onClose={() => setError(null)}>
          <IconButton
            onClick={() => setError(null)}
            style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <CloseIcon />
          </IconButton>
          <DialogTitle style={{ fontFamily: 'Newsreader, serif' }}>Error</DialogTitle>
          <DialogContent>{error}</DialogContent>
        </Dialog>
      )}
      <Button onClick={handleClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {user !== null ? (
            <Avatar avatarName={user.avatarName} width={30} height={30} circular={true} />
          ) : (
            <IoMdPerson />
          )}

          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              textDecoration: 'none',
              color: 'black',
              textTransform: 'none',
            }}>
            {text}
          </span>
        </div>
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={handleClose}>
        <MenuItem
          component={Link}
          to={user ? `profile/${user.username}` : 'register'}
          onClick={handleClose}
          style={{ fontFamily: 'Newsreader, serif' }}>
          Profile
        </MenuItem>

        <MenuItem onClick={handleLogout} style={{ fontFamily: 'Newsreader, serif' }}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
