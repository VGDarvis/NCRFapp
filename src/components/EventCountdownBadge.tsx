import { Badge } from '@/components/ui/badge';
import { getEventCountdown } from '@/lib/event-status-utils';
import { Clock } from 'lucide-react';

interface EventCountdownBadgeProps {
  eventDate: Date;
  className?: string;
}

export const EventCountdownBadge = ({ eventDate, className }: EventCountdownBadgeProps) => {
  const countdown = getEventCountdown(eventDate);
  
  const getVariant = () => {
    if (countdown === 'Today' || countdown === 'Starting Soon') return 'destructive';
    if (countdown === 'Tomorrow' || countdown.includes('days away')) return 'secondary';
    return 'outline';
  };

  return (
    <Badge variant={getVariant()} className={className}>
      <Clock className="h-3 w-3 mr-1" />
      {countdown}
    </Badge>
  );
};
