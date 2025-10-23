import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface QRScannerProps {
  eventId?: string;
}

export const QRScanner = ({ eventId }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [lastScan, setLastScan] = useState<{
    status: 'success' | 'error' | 'warning';
    message: string;
    attendee?: any;
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [scanning]);

  const startScanning = async () => {
    try {
      setCameraError('');
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      // Use back camera if available
      const selectedDeviceId = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back')
      )?.deviceId || videoInputDevices[0].deviceId;

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const qrCode = result.getText();
            handleScanResult(qrCode);
          }
        }
      );
    } catch (error: any) {
      console.error('Camera error:', error);
      setCameraError(error.message || 'Failed to access camera');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  const handleScanResult = async (qrCode: string) => {
    if (processing) return;
    
    setProcessing(true);
    try {
      // Extract QR code from URL if needed
      const code = qrCode.includes('/check-in/') 
        ? qrCode.split('/check-in/')[1] 
        : qrCode;

      // Look up registration
      const { data: registration, error: fetchError } = await supabase
        .from('registrations')
        .select(`
          *,
          events (
            id,
            title,
            start_at
          )
        `)
        .eq('qr_code', code)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!registration) {
        setLastScan({
          status: 'error',
          message: 'Invalid QR code - Registration not found',
        });
        toast.error('Invalid QR code');
        return;
      }

      // Check if already checked in
      if (registration.checked_in_at) {
        const checkedInDate = new Date(registration.checked_in_at).toLocaleString();
        setLastScan({
          status: 'warning',
          message: `Already checked in at ${checkedInDate}`,
          attendee: registration,
        });
        toast.warning('Already checked in');
        return;
      }

      // Check in the attendee
      const { data: { user } } = await supabase.auth.getUser();
      const { error: updateError } = await supabase
        .from('registrations')
        .update({
          checked_in_at: new Date().toISOString(),
          checked_in_by: user?.id || null,
          status: 'attended',
        })
        .eq('id', registration.id);

      if (updateError) throw updateError;

      setLastScan({
        status: 'success',
        message: `Welcome, ${registration.first_name} ${registration.last_name}!`,
        attendee: registration,
      });
      toast.success('Check-in successful!');
    } catch (error: any) {
      console.error('Check-in error:', error);
      setLastScan({
        status: 'error',
        message: error.message || 'Check-in failed',
      });
      toast.error('Check-in failed');
    } finally {
      setProcessing(false);
      setTimeout(() => setLastScan(null), 5000);
    }
  };

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      await handleScanResult(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">QR Code Scanner</h2>
            <Button
              onClick={() => setScanning(!scanning)}
              variant={scanning ? 'destructive' : 'default'}
            >
              <Camera className="w-4 h-4 mr-2" />
              {scanning ? 'Stop Scanner' : 'Start Scanner'}
            </Button>
          </div>

          {cameraError && (
            <Alert variant="destructive">
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          )}

          {scanning && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              {processing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="w-12 h-12 animate-spin text-white" />
                </div>
              )}
            </div>
          )}

          {lastScan && (
            <Alert
              variant={lastScan.status === 'error' ? 'destructive' : 'default'}
              className={
                lastScan.status === 'success'
                  ? 'border-green-500 bg-green-50'
                  : lastScan.status === 'warning'
                  ? 'border-yellow-500 bg-yellow-50'
                  : ''
              }
            >
              {lastScan.status === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {lastScan.status === 'error' && <XCircle className="h-4 w-4" />}
              {lastScan.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>
                <div className="font-semibold">{lastScan.message}</div>
                {lastScan.attendee && (
                  <div className="text-sm mt-2">
                    <div>Event: {lastScan.attendee.events?.title}</div>
                    <div>Email: {lastScan.attendee.email}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-4">
            <form onSubmit={handleManualEntry} className="space-y-3">
              <Label htmlFor="manual-code">Manual Entry (Backup)</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter QR code manually"
                  disabled={processing}
                />
                <Button type="submit" disabled={processing || !manualCode.trim()}>
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Check In'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};
