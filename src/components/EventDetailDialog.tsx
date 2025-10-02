import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Navigation, Download, Users, Info, Share2 } from "lucide-react";
import { format } from "date-fns";
import { downloadICSFile, getGoogleCalendarUrl, type CalendarEvent } from "@/lib/calendar-utils";
import { openNavigation, type NavigationDestination } from "@/lib/navigation-utils";
import { calculateDistance, formatDistance } from '@/lib/geolocation-utils';
import { getCapacityPercentage } from '@/lib/event-status-utils';
import { Progress } from '@/components/ui/progress';
import { ShareEventDialog } from './ShareEventDialog';
import { EventCountdownBadge } from './EventCountdownBadge';
import { EventStatusBadge } from './EventStatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  event_date: string;
  end_date: string | null;
  parking_info: string | null;
  accessibility_info: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  max_attendees: number | null;
  registration_deadline: string | null;
  featured_colleges: string[] | null;
  latitude?: number;
  longitude?: number;
}

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (eventId: string) => void;
  isGuest: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
}

export const EventDetailDialog = ({
  event,
  open,
  onOpenChange,
  onRegister,
  isGuest,
  userLocation,
}: EventDetailDialogProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  if (!event) return null;

  const distance = userLocation && event.latitude && event.longitude
    ? calculateDistance(userLocation.latitude, userLocation.longitude, event.latitude, event.longitude)
    : null;

  const capacityPercentage = getCapacityPercentage(event.max_attendees, 0);

  const handleAddToCalendar = (type: 'google' | 'apple' | 'outlook') => {
    const calendarEvent: CalendarEvent = {
      title: event.title,
      description: event.description || '',
      location: `${event.location_name}, ${event.address}, ${event.city}, ${event.state}`,
      startDate: new Date(event.event_date),
      endDate: event.end_date ? new Date(event.end_date) : new Date(event.event_date),
    };

    if (type === 'google') {
      window.open(getGoogleCalendarUrl(calendarEvent), '_blank');
    } else {
      downloadICSFile(calendarEvent, `${event.title.replace(/\s+/g, '-')}.ics`);
    }
  };

  const handleGetDirections = (app: 'google' | 'apple' | 'waze') => {
    const destination: NavigationDestination = {
      address: event.address,
      city: event.city,
      state: event.state,
      zipCode: event.zip_code || undefined,
    };
    openNavigation(destination, app);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-bold pr-8">{event.title}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <EventCountdownBadge eventDate={new Date(event.event_date)} />
              <EventStatusBadge
                registrationDeadline={event.registration_deadline ? new Date(event.registration_deadline) : undefined}
                maxAttendees={event.max_attendees || undefined}
              />
              {distance && (
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {formatDistance(distance)}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Type Badge */}
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {event.event_type.replace('_', ' ').toUpperCase()}
            </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                About This Event
              </h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          )}

          <Separator />

          {/* Date & Time */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date & Time
            </h3>
            <p className="text-muted-foreground">
              {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
              {event.end_date && event.end_date !== event.event_date && (
                <> - {format(new Date(event.end_date), "MMMM d, yyyy")}</>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {format(new Date(event.event_date), "h:mm a")}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </h3>
            <div className="text-muted-foreground">
              <p className="font-medium">{event.location_name}</p>
              <p>{event.address}</p>
              <p>{event.city}, {event.state} {event.zip_code}</p>
            </div>
          </div>

          {/* Parking & Accessibility */}
          {(event.parking_info || event.accessibility_info) && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              {event.parking_info && (
                <div>
                  <h4 className="font-medium text-sm mb-1">🅿️ Parking Information</h4>
                  <p className="text-sm text-muted-foreground">{event.parking_info}</p>
                </div>
              )}
              {event.accessibility_info && (
                <div>
                  <h4 className="font-medium text-sm mb-1">♿ Accessibility</h4>
                  <p className="text-sm text-muted-foreground">{event.accessibility_info}</p>
                </div>
              )}
            </div>
          )}

          {/* Featured Colleges */}
          {event.featured_colleges && event.featured_colleges.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Featured Colleges
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.featured_colleges.map((college, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {college}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(event.contact_email || event.contact_phone) && (
            <div className="space-y-2">
              <h3 className="font-semibold">Contact</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                {event.contact_email && <p>Email: {event.contact_email}</p>}
                {event.contact_phone && <p>Phone: {event.contact_phone}</p>}
              </div>
            </div>
          )}

          {/* Capacity Indicator */}
          {event.max_attendees && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Event Capacity</span>
                <span className="text-muted-foreground">{Math.round(capacityPercentage)}% full</span>
              </div>
              <Progress value={capacityPercentage} />
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleGetDirections('google')}>
                  Google Maps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGetDirections('apple')}>
                  Apple Maps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGetDirections('waze')}>
                  Waze
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAddToCalendar('google')}>
                  Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToCalendar('apple')}>
                  Apple Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToCalendar('outlook')}>
                  Outlook / iCal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => onRegister(event.id)}
              disabled={isGuest}
              className="flex-1"
            >
              {isGuest ? "Login to Register" : "Register Now"}
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
      
      <ShareEventDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        event={{
          id: event.id,
          title: event.title,
          location_name: event.location_name,
          event_date: event.event_date,
        }}
      />
    </>
  );
};
