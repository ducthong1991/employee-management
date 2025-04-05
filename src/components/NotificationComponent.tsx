import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { useNotification } from '../store/hooks';

const NotificationComponent: React.FC = () => {
  const { open, message, type } = useAppSelector(state => state.notification);
  const { hideNotification } = useNotification();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationComponent;
