import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ScheduleItem {
  time: string;
  activity: string;
}

interface EventScheduleProps {
  schedule: ScheduleItem[];
  eventDate: string;
}

export const EventSchedule = ({ schedule, eventDate }: EventScheduleProps) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      try {
        const distance = formatDistanceToNow(new Date(eventDate), { addSuffix: true });
        setCountdown(distance);
      } catch (error) {
        console.error('Error calculating countdown:', error);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="glass-premium p-6 rounded-2xl border border-violet-500/20">
      {/* Countdown */}
      <div className="mb-6 p-4 glass-light rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          <span className="text-sm text-muted-foreground">Event starts</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{countdown}</p>
      </div>

      {/* Schedule */}
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        Event Schedule
      </h2>
      
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-3 glass-light rounded-lg hover:bg-violet-400/5 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-[100px]">
              <Clock className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-foreground">{item.time}</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground">{item.activity}</p>
            </div>
            {index === 0 && (
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                First
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
