import { useCallback, useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import type { To } from 'react-router-dom';

interface UseNavigationGuardOptions {
  /**
   * When this is true, navigation will be blocked
   */
  isDirty: boolean;
  /**
   * Called when the user confirms they want to navigate away
   */
  onConfirm?: () => void;
  /**
   * Called when the user cancels navigation
   */
  onCancel?: () => void;
}

/**
 * A hook that provides a complete solution for guarding navigation
 * when a form has unsaved changes. Works with both React Router
 * navigation and browser refresh/close events.
 */
export function useNavigationGuard({ isDirty, onConfirm, onCancel }: UseNavigationGuardOptions) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<To | null>(null);
  const navigate = useNavigate();

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Create a blocker for React Router navigation
  const blocker = useBlocker(
    // Only block if form is dirty
    useCallback(() => isDirty, [isDirty])
  );

  // When navigation is blocked, show our prompt
  useEffect(() => {
    if (blocker.state === 'blocked' && isDirty) {
      setShowPrompt(true);
      setPendingLocation(blocker.location);
    } else {
      setShowPrompt(false);
    }
  }, [blocker, isDirty]);

  // Handle user's decision
  const handleConfirm = useCallback(() => {
    setShowPrompt(false);

    // Call the onConfirm callback if provided
    onConfirm?.();

    // Store the location before resetting anything
    const locationToNavigateTo = pendingLocation;

    // Reset pending state
    setPendingLocation(null);

    // Reset the blocker
    if (blocker.state === 'blocked') {
      blocker.reset();
    }

    // Now manually navigate to the desired location
    if (locationToNavigateTo) {
      // Small delay to ensure state updates have completed
      setTimeout(() => {
        navigate(locationToNavigateTo);
      }, 10);
    }
  }, [blocker, navigate, pendingLocation, onConfirm]);

  const handleCancel = useCallback(() => {
    setShowPrompt(false);
    setPendingLocation(null);

    // Call the onCancel callback if provided
    onCancel?.();

    // Reset the blocker
    blocker.reset?.();
  }, [blocker, onCancel]);

  // Navigate without triggering the prompt
  const navigateSafely = useCallback(
    (to: To) => {
      if (isDirty) {
        setShowPrompt(true);
        setPendingLocation(to);
      } else {
        navigate(to);
      }
    },
    [isDirty, navigate]
  );

  return {
    showPrompt,
    pendingLocation,
    handleConfirm,
    handleCancel,
    navigateSafely,
  };
}

export default useNavigationGuard;
