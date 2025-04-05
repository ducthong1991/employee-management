import { useEffect } from 'react';

/**
 * A custom hook that shows a browser warning when the user tries to
 * close or refresh the page with unsaved changes.
 *
 * @param shouldWarn Boolean indicating whether to show the warning
 */
export function useBeforeUnloadWarning(shouldWarn: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        // Standard way to show a confirmation dialog before unloading
        e.preventDefault();
        // For older browsers
        e.returnValue = '';
        return '';
      }
    };

    if (shouldWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldWarn]);
}

export default useBeforeUnloadWarning;
