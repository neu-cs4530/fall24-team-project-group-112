import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { ListItemButton, ListItemAvatar, Avatar } from '@mui/material';
import { blue } from '@mui/material/colors';
import './index.css';

/**
 * Interface representing the props for the FollowDisplay component.
 *
 * - usernames: The list of usernames to display.
 * - open: A boolean that determines if the dialog is open.
 * - onClose: A function that closes the dialog.
 * - type: A string that determines if the dialog is for followers or following.
 */
interface FollowDisplayProps {
  usernames: string[];
  open: boolean;
  onClose: () => void;
  type: 'Followers' | 'Following';
}

/**
 * FollowDisplay component that displays a list of usernames in a dialog.
 *
 * @param usernames The list of usernames to display.
 * @param open A boolean that determines if the dialog is open.
 * @param onClose A function that closes the dialog.
 * @param type A string that determines if the dialog is for followers or following.
 *
 * @returns A React component that displays a list of users.
 */
const FollowDisplay = ({ usernames, open, onClose, type }: FollowDisplayProps) => {
  const navigate = useNavigate();

  const routeToProfile = (username: string) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className='follow-display'>
        <DialogTitle>{type}</DialogTitle>
        <List sx={{ pt: 0 }}>
          {usernames.map(username => (
            <ListItem disableGutters key={username}>
              <ListItemButton onClick={() => routeToProfile(username)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={username} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Dialog>
  );
};

export default FollowDisplay;
