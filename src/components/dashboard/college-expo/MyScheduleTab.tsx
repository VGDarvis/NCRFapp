import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkCheck, Calendar, MapPin, Download, Loader2 } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { downloadQRCode } from '@/lib/qr-utils';
import { toast } from 'sonner';

export const MyScheduleTab = () => {
  const { myRegistrations, isLoadingMy } = useRegistrations();

  const handleDownloadQR = (registration: any) => {
    if (registration.qr_code_image_url) {
      downloadQRCode(
        registration.qr_code_image_url,
        `${registration.first_name}-${registration.last_name}-Registration.png`
      );
      toast.success('QR code downloaded!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'attended':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoadingMy) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!myRegistrations || myRegistrations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <BookmarkCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Registrations Yet</h2>
          <p className="text-muted-foreground">
            Register for an event to see your schedule and QR codes here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
        <p className="text-muted-foreground">
          Your registered events and QR codes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {myRegistrations.map((registration: any) => {
          const event = registration.events;
          const venue = event?.venues;
          const eventDate = new Date(event?.start_at || '').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <Card key={registration.id} className="overflow-hidden">
              {event?.image_url && (
                <div className="h-32 bg-gradient-to-br from-primary to-primary/60 relative">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-lg">{event?.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{eventDate}</span>
                    </div>
                    {venue && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{venue.city}, {venue.state}</span>
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(registration.status)}>
                    {registration.status}
                  </Badge>
                </div>

                {registration.qr_code_image_url && (
                  <div className="flex justify-center bg-white p-4 rounded-lg border">
                    <img 
                      src={registration.qr_code_image_url}
                      alt="QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownloadQR(registration)}
                    variant="outline"
                    className="flex-1"
                    disabled={!registration.qr_code_image_url}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                  Confirmation: #{registration.qr_code?.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
