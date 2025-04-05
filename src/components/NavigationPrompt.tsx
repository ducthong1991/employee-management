import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface NavigationPromptProps {
  /**
   * Controls whether the dialog is shown
   */
  open: boolean;
  /**
   * The title of the dialog
   */
  title?: string;
  /**
   * The message to display in the dialog
   */
  message?: string;
  /**
   * Text for the confirm button
   */
  confirmText?: string;
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  /**
   * Called when the user confirms they want to navigate away
   */
  onConfirm: () => void;
  /**
   * Called when the user cancels navigation
   */
  onCancel: () => void;
}

/**
 * A reusable dialog component for confirming navigation when
 * there are unsaved changes.
 */
export const NavigationPrompt: React.FC<NavigationPromptProps> = ({
  open,
  title = 'Unsaved Changes',
  message = 'You have unsaved changes. If you leave this page, your changes will be lost.',
  confirmText = 'Leave Page',
  cancelText = 'Stay on Page',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="navigation-prompt-title"
      aria-describedby="navigation-prompt-description"
    >
      <DialogTitle id="navigation-prompt-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="navigation-prompt-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavigationPrompt;
