import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import { ListItemButton, ListItemAvatar, Stack } from '@mui/material';
import { AvatarNames } from '../../../../types';
import Avatar from '../../baseComponents/avatar';

/**
 * Interface representing the props for the AvatarDisplay component.
 *
 * - open: A boolean that determines if the dialog is open.
 * - onClose: A function that closes the dialog.
 * - onSelectAvatar: A function that selects an avatar.
 */
interface AvatarDisplayProps {
  open: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarName: string) => void;
}

/**
 * AvatarDisplay component that displays a list of avatar options in a dialog.
 *
 * @param open A boolean that determines if the dialog is open.
 * @param onClose A function that closes the dialog.
 * @param onSelectAvatar A function that selects an avatar.
 *
 * @returns A React component that displays a list of users.
 */
const AvatarDisplay = ({ open, onClose, onSelectAvatar }: AvatarDisplayProps) => {
  const styles = {
    dialogContainer: 'w-[500px]',
    title: 'pl-5 pt-5 text-xl font-bold',
    avatarContainer: 'max-w-4',
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className={styles.dialogContainer}>
        <p className={styles.title}> Select Avatar </p>
        <List sx={{ pt: 0 }} component={Stack} direction='row' spacing={10}>
          {Object.values(AvatarNames).map(avatarName => (
            <ListItem disableGutters key={avatarName}>
              <ListItemButton
                onClick={() => {
                  onSelectAvatar(avatarName);
                  onClose();
                }}>
                <ListItemAvatar>
                  <span className={styles.avatarContainer}>
                    <Avatar avatarName={avatarName} />
                  </span>
                </ListItemAvatar>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Dialog>
  );
};

export default AvatarDisplay;
