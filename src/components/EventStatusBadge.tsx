import { Badge } from '@/components/ui/badge';
import { getRegistrationStatus } from '@/lib/event-status-utils';
import { AlertCircle } from 'lucide-react';

interface EventStatusBadgeProps {
  registrationDeadline?: Date;
  maxAttendees?: number;
  currentAttendees?: number;
  className?: string;
}

export const EventStatusBadge = ({
  registrationDeadline,
  maxAttendees,
  currentAttendees = 0,
  className,
}: EventStatusBadgeProps) => {
  const status = getRegistrationStatus(registrationDeadline, maxAttendees, currentAttendees);
  
  if (!status) return null;

  return (
    <Badge variant={status.variant} className={className}>
      {status.urgency === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
      {status.label}
    </Badge>
  );
};
