/**
 * Utility functions for date and time formatting
 */

/**
 * Format a date to French locale string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format a price to XOF currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(amount);
}

/**
 * Format a phone number to Senegal format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 221, keep it
  if (digits.startsWith('221')) {
    return `+${digits}`;
  }
  
  // If it starts with 0, remove it and add 221
  if (digits.startsWith('0')) {
    return `+221${digits.slice(1)}`;
  }
  
  // Otherwise just add 221
  return `+221${digits}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get time slots for booking
 */
export function getTimeSlots(): string[] {
  return [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];
}

/**
 * Get service types
 */
export function getServiceTypes(): string[] {
  return [
    'Installation de Canalisations',
    'Réparation de Fuites',
    'Débouchage de Canalisations',
    'Installation de Chauffe-eau',
    'Maintenance Préventive',
  ];
}

/**
 * Calculate booking duration in hours
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  return endHour - startHour;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get status label in French
 */
export function getStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'En Attente';
    case 'CONFIRMED':
      return 'Confirmé';
    case 'COMPLETED':
      return 'Terminé';
    case 'CANCELLED':
      return 'Annulé';
    default:
      return status;
  }
}
