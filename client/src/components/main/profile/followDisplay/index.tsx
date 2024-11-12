import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import { ListItemButton, ListItemAvatar } from '@mui/material';
import { Follow } from '../../../../types';
import Avatar from '../../baseComponents/avatar';

/**
 * Interface representing the props for the FollowDisplay component.
 *
 * - follows: The list of followers or followees to display.
 * - open: A boolean that determines if the dialog is open.
 * - onClose: A function that closes the dialog.
 * - type: A string that determines if the dialog is for followers or following.
 */
interface FollowDisplayProps {
  follows: Follow[];
  open: boolean;
  onClose: () => void;
  type: 'Followers' | 'Following';
}

/**
 * FollowDisplay component that displays a list of usernames in a dialog.
 *
 * @param follows The list of usernames to display.
 * @param open A boolean that determines if the dialog is open.
 * @param onClose A function that closes the dialog.
 * @param type A string that determines if the dialog is for followers or following.
 *
 * @returns A React component that displays a list of users.
 */
const FollowDisplay = ({ follows, open, onClose, type }: FollowDisplayProps) => {
  const navigate = useNavigate();

  const routeToProfile = (username: string) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className='w-[500px]'>
        <p className='pl-5 pt-5 text-xl font-bold'>{type}</p>
        <List sx={{ pt: 0 }}>
          {follows.map((follow, idx) => (
            <ListItem disableGutters key={idx}>
              <ListItemButton onClick={() => routeToProfile(follow.user.username)}>
                <ListItemAvatar>
                  <span className='max-w-4'>
                    <Avatar
                      avatarName={follow.user.avatarName || 'avatar1'}
                      width={50}
                      height={50}
                    />
                  </span>
                </ListItemAvatar>
                <div className='flex-col ml-2'>
                  <ListItemText primary={`${follow.user.firstName} ${follow.user.lastName}`} />
                  <ListItemText primary={`@${follow.user.username}`} />
                </div>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Dialog>
  );
};

export default FollowDisplay;
