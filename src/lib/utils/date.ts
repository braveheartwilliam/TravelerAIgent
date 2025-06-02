/**
 * Format a date to a readable string format
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Calculate the duration in days between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of days
 */
export function calculateDurationDays(startDate: Date | string | undefined, endDate: Date | string | undefined): number {
  if (!startDate || !endDate) return 0;
  
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Format a date range
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date | string | undefined, endDate: Date | string | undefined): string {
  if (!startDate || !endDate) return '';
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param date The date to get relative time for
 * @returns Relative time string
 */
export function getRelativeTimeString(date: Date | string | undefined): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}
