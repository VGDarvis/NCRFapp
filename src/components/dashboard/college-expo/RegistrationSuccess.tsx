import { Download, Mail, Calendar, Share2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { downloadQRCode } from '@/lib/qr-utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RegistrationSuccessProps {
  registration: {
    id: string;
    qr_code: string;
    qr_code_image_url?: string;
    first_name: string;
    last_name: string;
    email: string;
    event_id: string;
  };
  event: {
    title: string;
    start_at: string;
    venue?: {
      name: string;
      city: string;
      state: string;
    };
  };
  onViewSchedule: () => void;
}

export const RegistrationSuccess = ({ 
  registration, 
  event,
  onViewSchedule 
}: RegistrationSuccessProps) => {
  const handleDownload = () => {
    if (registration.qr_code_image_url) {
      downloadQRCode(
        registration.qr_code_image_url,
        `${registration.first_name}-${registration.last_name}-${event.title.replace(/\s+/g, '-')}.png`
      );
      toast.success('QR code downloaded!');
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-registration-confirmation', {
        body: { registration_id: registration.id }
      });
      
      if (error) throw error;
      toast.success('Confirmation email resent!');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend email. Please try again.');
    }
  };

  const handleShare = () => {
    const shareText = `I'm registered for ${event.title}! Join me at this amazing event.`;
    const shareUrl = `${window.location.origin}/join-college-expo?event=${registration.event_id}`;
    
    if (navigator.share) {
      navigator.share({ title: event.title, text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Event link copied to clipboard!');
    }
  };

  const eventDate = new Date(event.start_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold">Registration Confirmed!</h2>
        <p className="text-muted-foreground">
          You're all set for {event.title}
        </p>
      </div>

      {registration.qr_code_image_url && (
        <Card className="p-6 flex justify-center bg-white">
          <img 
            src={registration.qr_code_image_url} 
            alt="Registration QR Code"
            className="w-64 h-64"
          />
        </Card>
      )}

      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{eventDate}</span>
        </div>
        {event.venue && (
          <div className="text-sm text-muted-foreground">
            {event.venue.name} • {event.venue.city}, {event.venue.state}
          </div>
        )}
        <div className="text-sm font-medium pt-2 border-t">
          Confirmation: #{registration.qr_code.slice(0, 8).toUpperCase()}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleDownload} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download QR
        </Button>
        <Button onClick={handleResendEmail} variant="outline" className="w-full">
          <Mail className="w-4 h-4 mr-2" />
          Email QR
        </Button>
        <Button onClick={handleShare} variant="outline" className="w-full col-span-2">
          <Share2 className="w-4 h-4 mr-2" />
          Share Event
        </Button>
        <Button onClick={onViewSchedule} className="w-full col-span-2">
          View My Schedule
        </Button>
      </div>

      <div className="text-xs text-center text-muted-foreground">
        Show this QR code at the event entrance for check-in
      </div>
    </div>
  );
};
