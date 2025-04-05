import { DateTime } from 'luxon';

/**
 * Formats a date string using Luxon
 * @param dateString - The date string to format
 * @param formatType - The format type to use (defaults to short date)
 * @returns Formatted date string or original input if formatting fails
 */
export const formatDate = (
  dateString: string | null | undefined,
  formatType: 'short' | 'long' | 'full' = 'short'
): string => {
  // If no date is provided, return empty string
  if (!dateString) return '';

  try {
    const dateTime = DateTime.fromISO(dateString);

    // Choose formatting based on input
    switch (formatType) {
      case 'short':
        return dateTime.toLocaleString(DateTime.DATE_SHORT);
      case 'long':
        return dateTime.toLocaleString(DateTime.DATE_FULL);
      case 'full':
        return dateTime.toLocaleString(DateTime.DATETIME_FULL);
      default:
        return dateTime.toLocaleString(DateTime.DATE_SHORT);
    }
  } catch (e) {
    // Return original string if parsing fails
    return dateString;
  }
};
