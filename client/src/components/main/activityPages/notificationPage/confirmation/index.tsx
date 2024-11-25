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
 * @returns A React component that displays a confirmation message.
 */
const ConfirmationDisplay = ({ open, onClose, onConfirm }: ConfirmationDisplayProps) => {
  const styles = {
    dialogContainer: 'md:w-[500px] p-5 bg-white rounded shadow-lg',
    title: 'text-xl font-bold text-white bg-red-400 p-3 rounded-t',
    message: 'text-left text-gray-700 mt-4',
    buttonContainer: 'flex justify-end mt-5',
    button: 'border border-black rounded px-4 py-2 mx-2',
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className={styles.dialogContainer}>
        <p className={styles.title}>Confirm</p>
        <p className={styles.message}>Are you sure you want to delete all of your notifications?</p>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className={styles.button}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}>
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationDisplay;
