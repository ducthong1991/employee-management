import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Notification specific hook for ease of use
import { showNotification, hideNotification, NotificationType } from './notificationSlice';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  return {
    showNotification: (message: string, type?: NotificationType) =>
      dispatch(showNotification({ message, type })),
    hideNotification: () => dispatch(hideNotification()),
  };
};
