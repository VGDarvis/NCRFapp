import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, ExternalLink, Share2, Download, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { downloadICSFile } from '@/lib/calendar-utils';
import { openNavigation, type NavigationDestination } from '@/lib/navigation-utils';
import tournamentFlyer from '@/assets/steam-smash-bros-tournament.jpg';

interface EventHeroProps {
  event: {
    id: string;
    title: string;
    description: string;
    event_date: string;
    end_date: string;
    location_name: string;
    address: string;
    city: string;
    state: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
    prize_pool?: string;
    admission_fee?: string;
    registration_link?: string;
    event_flyer_url?: string;
  };
}

export const EventHero = ({ event }: EventHeroProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSaveToCalendar = () => {
    downloadICSFile({
      title: event.title,
      description: event.description,
      location: `${event.location_name}, ${event.address}, ${event.city}, ${event.state}`,
      startDate: new Date(event.event_date),
      endDate: new Date(event.end_date),
    });
    toast.success('Event saved to calendar!');
  };

  const handleGetDirections = () => {
    const destination: NavigationDestination = {
      address: event.address,
      city: event.city,
      state: event.state,
      zipCode: event.zip_code,
      latitude: event.latitude,
      longitude: event.longitude,
    };
    
    openNavigation(destination);
    toast.success('Opening directions...');
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/dashboard?program=steam&event=${event.id}`;
    
    const shareData = {
      title: event.title,
      text: `🎮 ${event.title}\n📅 ${format(new Date(event.event_date), 'EEEE, MMMM dd, yyyy')}\n📍 ${event.location_name}, ${event.city}, ${event.state}\n💰 ${event.prize_pool || 'Free Entry'}\n\nJoin us for an amazing STEAM event!`,
      url: eventUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Event shared successfully!');
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          navigator.clipboard.writeText(eventUrl);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(eventUrl);
      toast.success('Event link copied! Share it with friends and family.');
    }
  };

  return (
    <div className="glass-premium p-6 rounded-2xl border border-purple-500/20">
      {/* Event Flyer */}
      <div className="mb-6 rounded-xl overflow-hidden">
        <img 
          src={tournamentFlyer}
          alt={event.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Event Title & Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {event.title}
          </h1>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Featured Event
          </Badge>
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 glass-light rounded-lg">
          <Calendar className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-semibold text-foreground">
              {format(new Date(event.event_date), 'EEEE, MMM dd, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.event_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 glass-light rounded-lg">
          <MapPin className="w-5 h-5 text-violet-400" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold text-foreground">{event.location_name}</p>
            <p className="text-sm text-muted-foreground">
              {event.city}, {event.state}
            </p>
          </div>
        </div>

        {event.prize_pool && (
          <div className="flex items-center gap-3 p-3 glass-light rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Prize Pool</p>
              <p className="font-semibold text-foreground">{event.prize_pool}</p>
            </div>
          </div>
        )}

        {event.admission_fee && (
          <div className="flex items-center gap-3 p-3 glass-light rounded-lg">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
              {event.admission_fee}
            </Badge>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {showFullDescription ? event.description : `${event.description.slice(0, 150)}...`}
          {event.description.length > 150 && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-purple-400 ml-2 hover:underline"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {event.registration_link && (
          <Button 
            onClick={() => window.open(event.registration_link, '_blank')}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        )}
        
        <Button 
          onClick={handleGetDirections}
          variant="outline"
          className="glass-light border-blue-500/20"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>

        <Button 
          onClick={handleSaveToCalendar}
          variant="outline"
          className="glass-light border-purple-500/20"
        >
          <Download className="w-4 h-4 mr-2" />
          Save to Calendar
        </Button>

        <Button 
          onClick={handleShare}
          variant="outline"
          className="glass-light border-violet-500/20"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Event
        </Button>
      </div>
    </div>
  );
};
