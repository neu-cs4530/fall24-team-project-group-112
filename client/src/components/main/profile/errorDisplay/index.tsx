import Dialog from '@mui/material/Dialog';

/**
 * Interface representing the props for the ErrorDisplay component.
 *
 * - error: The error message to display.
 * - open: A boolean that determines if the dialog is open.
 * - onClose: A function that closes the dialog.
 */
interface ErrorDisplayProps {
  error: string;
  open: boolean;
  onClose: () => void;
}

/**
 * ErrorDisplay component that displays an error in a dialog.
 *
 * @param error The error message to display.
 * @param open A boolean that determines if the dialog is open.
 * @param onClose A function that closes the dialog.
 *
 * @returns A React component that display an error.
 */
const ErrorDisplay = ({ error, open, onClose }: ErrorDisplayProps) => {
  const styles = {
    dialogContainer: 'w-[500px] p-5',
    title: 'text-xl font-bold text-white bg-red-500 p-3',
    errorMessage: 'text-left text-gray-700 mt-4',
  };

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <div className={styles.dialogContainer}>
        <p className={styles.title}>Error</p>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    </Dialog>
  );
};

export default ErrorDisplay;
