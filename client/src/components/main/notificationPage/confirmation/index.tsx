import Dialog from '@mui/material/Dialog';

/**
 * Interface representing the props for the ErrorDisplay component.
 *
 * - open: A boolean that determines if the dialog is open.
 * - onClose: A function that closes the dialog.
 * - onConfirm: A function that is called when the user confirms the action.
 */
interface ConfirmationDisplayProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * ConfirmationDisplay component that displays an error in a dialog.
 *
 * @param open A boolean that determines if the dialog is open.
 * @param onClose A function that closes the dialog.
 * @param onConfirm A function that is called when the user confirms the action.
 *
 * @returns A React component that display an error.
 */
const ConfirmationDisplay = ({ open, onClose, onConfirm }: ConfirmationDisplayProps) => {
  const styles = {
    dialogContainer: 'w-[500px] p-5',
    title: 'text-xl font-bold text-white bg-red-500 p-3',
    errorMessage: 'text-left text-gray-700 mt-4',
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className={styles.dialogContainer}>
        <p className={styles.title}>Confirm</p>
        <p>Are you sure you want to delete all of your notifications?</p>
        <button onClick={() => onClose()}>Cancel</button>
        <button onClick={() => onConfirm()}>Delete</button>
      </div>
    </Dialog>
  );
};

export default ConfirmationDisplay;
