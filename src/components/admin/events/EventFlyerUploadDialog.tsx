import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Wand2, Save } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventFlyerUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
}

export function EventFlyerUploadDialog({ open, onOpenChange, eventId }: EventFlyerUploadDialogProps) {
  const { events, updateEvent } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [flyerUrl, setFlyerUrl] = useState<string>("");
  
  // Extracted data from AI
  const [extractedData, setExtractedData] = useState({
    title: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    venueName: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setFlyerFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFlyerPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!flyerFile) return;

    setUploading(true);
    try {
      const fileName = `flyer-${selectedEventId}-${Date.now()}.${flyerFile.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('event_assets')
        .upload(fileName, flyerFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('event_assets')
        .getPublicUrl(data.path);

      setFlyerUrl(publicUrl);
      toast.success('Flyer uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload flyer: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleScanFlyer = async () => {
    if (!flyerUrl) {
      toast.error('Please upload the flyer first');
      return;
    }

    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('scan-event-flyer', {
        body: { flyer_url: flyerUrl, event_id: selectedEventId }
      });

      if (error) throw error;

      if (data.success && data.extracted_data) {
        setExtractedData({
          title: data.extracted_data.event_title || "",
          eventDate: data.extracted_data.event_date || "",
          startTime: data.extracted_data.start_time || "",
          endTime: data.extracted_data.end_time || "",
          venueName: data.extracted_data.venue_name || "",
          address: data.extracted_data.full_address || "",
          city: data.extracted_data.city || "",
          state: data.extracted_data.state || "",
          zipCode: data.extracted_data.zip_code || ""
        });
        
        toast.success('Flyer scanned successfully!', {
          description: `Confidence: ${(data.confidence_score * 100).toFixed(0)}%`
        });
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error('Failed to scan flyer: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const geocodeAddress = async (address: string, city: string, state: string, zipCode: string) => {
    try {
      // Get Mapbox token
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
      if (tokenError || !tokenData?.token) {
        console.error('Failed to get Mapbox token:', tokenError);
        return null;
      }

      // Geocode the address
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${tokenData.token}`;
      
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.features?.[0]) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const findOrCreateVenue = async (venueData: any, coordinates: { latitude: number; longitude: number } | null) => {
    try {
      // Search for existing venue by name and city
      const { data: existingVenue } = await supabase
        .from('venues')
        .select('*')
        .eq('name', venueData.venueName)
        .eq('city', venueData.city)
        .maybeSingle();

      if (existingVenue) {
        // Update existing venue with new coordinates
        const venueUpdates: any = {
          address: venueData.address,
          state: venueData.state,
          zip_code: venueData.zipCode,
          updated_at: new Date().toISOString()
        };

        if (coordinates) {
          venueUpdates.latitude = coordinates.latitude;
          venueUpdates.longitude = coordinates.longitude;
        }

        await supabase
          .from('venues')
          .update(venueUpdates)
          .eq('id', existingVenue.id);

        return existingVenue.id;
      } else {
        // Create new venue
        const newVenueData: any = {
          name: venueData.venueName,
          address: venueData.address,
          city: venueData.city,
          state: venueData.state,
          zip_code: venueData.zipCode,
          venue_type: 'high_school',
          amenities: ['WiFi', 'Parking', 'Restrooms', 'Air Conditioning'],
          parking_info: 'Free parking available in school parking lot',
          accessibility_info: 'Accessible gymnasium and restrooms available'
        };

        if (coordinates) {
          newVenueData.latitude = coordinates.latitude;
          newVenueData.longitude = coordinates.longitude;
        }

        const { data: newVenue, error } = await supabase
          .from('venues')
          .insert(newVenueData)
          .select()
          .single();

        if (error) throw error;
        return newVenue.id;
      }
    } catch (error) {
      console.error('Venue creation/update error:', error);
      return null;
    }
  };

  const handleSaveAndPublish = async () => {
    if (!selectedEventId) {
      toast.error('Please select an event');
      return;
    }

    try {
      const updates: any = {
        event_flyer_url: flyerUrl,
        flyer_scanned_at: new Date().toISOString(),
        flyer_manual_override: false
      };

      if (extractedData.title) updates.title = extractedData.title;
      if (extractedData.eventDate && extractedData.startTime) {
        updates.start_at = `${extractedData.eventDate}T${extractedData.startTime}:00`;
      }
      if (extractedData.eventDate && extractedData.endTime) {
        updates.end_at = `${extractedData.eventDate}T${extractedData.endTime}:00`;
      }

      // Geocode venue address if we have venue info
      if (extractedData.venueName && extractedData.address && extractedData.city && extractedData.state) {
        toast.loading('Geocoding venue address...', { id: 'geocoding' });
        
        const coordinates = await geocodeAddress(
          extractedData.address,
          extractedData.city,
          extractedData.state,
          extractedData.zipCode
        );

        if (coordinates) {
          toast.success('Location found on map!', { id: 'geocoding' });
        } else {
          toast.warning('Could not geocode address', { id: 'geocoding' });
        }

        // Create or update venue
        const venueId = await findOrCreateVenue(extractedData, coordinates);
        
        if (venueId) {
          updates.venue_id = venueId;
          toast.success('Venue updated with location data');
        }
      }

      await updateEvent.mutateAsync({
        id: selectedEventId,
        updates
      });

      toast.success('Event published!', {
        description: 'Users will see the updates immediately'
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Event Flyer</DialogTitle>
          <DialogDescription>
            Upload a new flyer and let AI extract event details automatically
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Selector */}
          <div className="space-y-2">
            <Label>Select Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((event: any) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} - {new Date(event.start_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Flyer Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={!selectedEventId || uploading}
              />
              <Button
                onClick={handleUpload}
                disabled={!flyerFile || uploading || !selectedEventId}
                size="icon"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Flyer Preview */}
          {flyerPreview && (
            <div className="glass-medium p-4 rounded-lg">
              <Label className="mb-2 block">Preview</Label>
              <img 
                src={flyerPreview} 
                alt="Flyer preview" 
                className="max-h-64 mx-auto rounded-lg"
              />
            </div>
          )}

          {/* AI Scan Button */}
          {flyerUrl && (
            <Button
              onClick={handleScanFlyer}
              disabled={scanning}
              className="w-full"
              variant="outline"
            >
              {scanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning Flyer with AI...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Scan Flyer with AI
                </>
              )}
            </Button>
          )}

          {/* Extracted Data Fields */}
          {extractedData.title && (
            <div className="glass-premium p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Extracted Information</h3>
              <p className="text-sm text-muted-foreground">Review and edit the details below before publishing</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={extractedData.eventDate}
                    onChange={(e) => setExtractedData({ ...extractedData, eventDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={extractedData.startTime}
                    onChange={(e) => setExtractedData({ ...extractedData, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={extractedData.endTime}
                    onChange={(e) => setExtractedData({ ...extractedData, endTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Venue Name</Label>
                  <Input
                    value={extractedData.venueName}
                    onChange={(e) => setExtractedData({ ...extractedData, venueName: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={extractedData.address}
                    onChange={(e) => setExtractedData({ ...extractedData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={extractedData.city}
                    onChange={(e) => setExtractedData({ ...extractedData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={extractedData.state}
                    onChange={(e) => setExtractedData({ ...extractedData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={extractedData.zipCode}
                    onChange={(e) => setExtractedData({ ...extractedData, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndPublish}
              disabled={!flyerUrl || !selectedEventId}
              className="action-button"
            >
              <Save className="mr-2 h-4 w-4" />
              Save & Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
