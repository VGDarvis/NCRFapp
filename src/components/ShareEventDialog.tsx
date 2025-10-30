import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Mail, MessageSquare, Copy, Download, Check } from 'lucide-react';
import { generateEventQRCode, downloadQRCode } from '@/lib/qr-utils';
import { generateEventRegistrationUrl } from '@/lib/domain-config';
import { toast } from 'sonner';

interface ShareEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    location_name: string;
    event_date: string;
  };
}

export const ShareEventDialog = ({ isOpen, onClose, event }: ShareEventDialogProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const eventUrl = generateEventRegistrationUrl(event.id);

  useEffect(() => {
    if (isOpen) {
      generateEventQRCode(event.id).then(setQrCode);
    }
  }, [isOpen, event.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join me at ${event.title}`);
    const body = encodeURIComponent(
      `I'm attending ${event.title} at ${event.location_name} on ${new Date(event.event_date).toLocaleDateString()}.\n\nJoin me! Register here: ${eventUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Join me at ${event.title} on ${new Date(event.event_date).toLocaleDateString()}! Register: ${eventUrl}`
    );
    window.open(`sms:?&body=${message}`);
  };

  const downloadQR = () => {
    if (qrCode) {
      downloadQRCode(qrCode, `${event.title}-qr.png`);
      toast.success('QR code downloaded!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Event Link</Label>
            <div className="flex gap-2">
              <Input value={eventUrl} readOnly />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={shareViaEmail} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button onClick={shareViaSMS} variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>

          {qrCode && (
            <div className="space-y-2">
              <Label>QR Code</Label>
              <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
                <img src={qrCode} alt="Event QR Code" className="w-48 h-48" />
                <Button onClick={downloadQR} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
