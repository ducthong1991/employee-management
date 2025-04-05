import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { To } from 'react-router-dom';

interface UseNavigationGuardOptions {
  /**
   * When this is true, navigation will be blocked
   */
  shouldBlock: boolean;
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
 * A simplified navigation guard hook that doesn't rely on React Router's
 * blocking mechanisms. Instead, it just provides a clean interface for
 * showing a confirmation dialog when the user tries to navigate away.
 */
export function useNavigationGuard({
  shouldBlock,
  onConfirm,
  onCancel,
}: UseNavigationGuardOptions) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<To | null>(null);
  const navigate = useNavigate();

  // Handle user's decision to proceed with navigation
  const handleConfirm = useCallback(() => {
    // Store the location we want to navigate to
    const locationToNavigateTo = pendingLocation;

    // First call the onConfirm callback if provided
    if (onConfirm) {
      onConfirm();
    }

    // Hide the prompt
    setShowPrompt(false);
    setPendingLocation(null);

    // Navigate to the target location
    if (locationToNavigateTo) {
      navigate(locationToNavigateTo);
    }
  }, [navigate, pendingLocation, onConfirm]);

  // Handle user's decision to cancel navigation
  const handleCancel = useCallback(() => {
    // Call the onCancel callback if provided
    if (onCancel) {
      onCancel();
    }

    // Reset state
    setShowPrompt(false);
    setPendingLocation(null);
  }, [onCancel]);

  // Function to initiate navigation with confirmation if needed
  const navigateSafely = useCallback(
    (to: To) => {
      if (shouldBlock) {
        // If we should block, show the prompt
        setShowPrompt(true);
        setPendingLocation(to);
      } else {
        // Otherwise just navigate
        navigate(to);
      }
    },
    [shouldBlock, navigate]
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
