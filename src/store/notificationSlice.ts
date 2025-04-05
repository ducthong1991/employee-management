import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
}

const initialState: NotificationState = {
  open: false,
  message: '',
  type: 'success',
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: NotificationType }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
    },
    hideNotification: state => {
      state.open = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
