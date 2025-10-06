import { useState } from 'react';
import { Calendar, MapPin, Share2, ExternalLink, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { downloadICSFile } from '@/lib/calendar-utils';
import sapFlyerImage from '@/assets/sap-recruiting-seminars-flyer.png';

interface EventHeroProps {
  event: {
    title: string;
    eventDate: string;
    locationName: string;
    description: string;
    registrationLink: string;
    isFree: boolean;
  };
}

export const EventHero = ({ event }: EventHeroProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { toast } = useToast();

  const handleSaveToCalendar = () => {
    downloadICSFile({
      title: event.title,
      description: event.description,
      location: event.locationName,
      startDate: new Date(event.eventDate),
      endDate: new Date(new Date(event.eventDate).getTime() + 2 * 60 * 60 * 1000),
    }, `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`);

    toast({
      title: "Calendar Event Created",
      description: "The event has been saved to your calendar",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Check out this SAP event: ${event.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const descriptionPreview = event.description.slice(0, 150);
  const shouldShowReadMore = event.description.length > 150;

  return (
    <div className="glass-premium rounded-2xl border border-amber-500/20 overflow-hidden">
      {/* Event Flyer */}
      <div className="relative aspect-video bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <img 
          src={sapFlyerImage}
          alt={event.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Event Details */}
      <div className="p-6 space-y-6">
        {/* Title and Badge */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {event.title}
            </h1>
            {event.isFree && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 shrink-0">
                Free for SAP Members
              </Badge>
            )}
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 glass-light rounded-lg">
            <Calendar className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Workshop Series</p>
              <p className="font-semibold text-foreground">4-Part Virtual Seminars</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 glass-light rounded-lg">
            <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Format</p>
              <p className="font-semibold text-foreground">{event.locationName}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">About This Event</h3>
          <p className="text-muted-foreground leading-relaxed">
            {showFullDescription ? event.description : descriptionPreview}
            {shouldShowReadMore && !showFullDescription && '...'}
          </p>
          {shouldShowReadMore && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              {showFullDescription ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
            onClick={() => window.open(event.registrationLink, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Register Now
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSaveToCalendar}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Save to Calendar
          </Button>

          <Button 
            variant="outline" 
            onClick={handleShare}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
