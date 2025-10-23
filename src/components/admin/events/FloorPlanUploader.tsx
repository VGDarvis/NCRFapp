import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FloorPlanUploaderProps {
  venueId: string;
  onUploadComplete?: () => void;
}

export function FloorPlanUploader({ venueId, onUploadComplete }: FloorPlanUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [floorNumber, setFloorNumber] = useState(1);
  const [floorName, setFloorName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload SVG, PNG, JPG, or PDF');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to storage
      const fileName = `${venueId}/floor-${floorNumber}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setUploadProgress(75);

      // Insert floor plan record
      const { error: dbError } = await supabase
        .from('floor_plans')
        .insert({
          venue_id: venueId,
          floor_number: floorNumber,
          floor_name: floorName || `Floor ${floorNumber}`,
          image_url: publicUrl,
          scale_factor: 1.0,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast.success('Floor plan uploaded successfully!');
      
      // Reset form
      setFile(null);
      setFloorNumber(floorNumber + 1);
      setFloorName("");
      
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload floor plan');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Floor Plan</CardTitle>
        <CardDescription>
          Upload SVG, PNG, JPG, or PDF floor plans for this venue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="floor-number">Floor Number</Label>
          <Input
            id="floor-number"
            type="number"
            min={1}
            value={floorNumber}
            onChange={(e) => setFloorNumber(parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-name">Floor Name (Optional)</Label>
          <Input
            id="floor-name"
            type="text"
            placeholder="e.g., Main Hall, Upper Level"
            value={floorName}
            onChange={(e) => setFloorName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-plan-file">Floor Plan File</Label>
          <Input
            id="floor-plan-file"
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {file && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Selected: {file.name}
            </p>
          )}
        </div>

        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Floor Plan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
