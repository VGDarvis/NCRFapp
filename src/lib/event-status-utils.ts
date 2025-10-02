// Event status utilities for countdown timers and status indicators

export interface EventStatus {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  urgency: 'low' | 'medium' | 'high';
}

export const getEventCountdown = (eventDate: Date): string => {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days < 0) return 'Past Event';
  if (days === 0 && hours < 2) return 'Starting Soon';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days away`;
  if (days <= 30) return `${Math.floor(days / 7)} weeks away`;
  return `${Math.floor(days / 30)} months away`;
};

export const getRegistrationStatus = (
  registrationDeadline?: Date,
  maxAttendees?: number,
  currentAttendees: number = 0
): EventStatus | null => {
  if (!registrationDeadline && !maxAttendees) return null;

  // Check capacity
  if (maxAttendees) {
    const percentFull = (currentAttendees / maxAttendees) * 100;
    if (percentFull >= 100) {
      return { label: 'Full', variant: 'destructive', urgency: 'high' };
    }
    if (percentFull >= 90) {
      return { label: 'Almost Full', variant: 'destructive', urgency: 'high' };
    }
    if (percentFull >= 75) {
      return { label: 'Limited Spots', variant: 'secondary', urgency: 'medium' };
    }
  }

  // Check deadline
  if (registrationDeadline) {
    const now = new Date();
    const diff = registrationDeadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return { label: 'Registration Closed', variant: 'destructive', urgency: 'high' };
    }
    if (days <= 3) {
      return { label: 'Registration Closing Soon', variant: 'destructive', urgency: 'high' };
    }
    if (days <= 7) {
      return { label: 'Register Soon', variant: 'secondary', urgency: 'medium' };
    }
  }

  return null;
};

export const getCapacityPercentage = (maxAttendees?: number, currentAttendees: number = 0): number => {
  if (!maxAttendees) return 0;
  return Math.min((currentAttendees / maxAttendees) * 100, 100);
};
