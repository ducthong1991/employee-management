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
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A simplified dialog component for confirming navigation when
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
  // Handle confirmation with a direct approach
  const handleConfirmClick = () => {
    // Call onConfirm directly
    onConfirm();
  };

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
        <Button onClick={handleConfirmClick} color="primary" variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavigationPrompt;
