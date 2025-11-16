import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, Printer, QrCode } from "lucide-react";
import { generateQRCode, downloadQRCode } from "@/lib/qr-utils";
import { generateGuestAccessUrl } from "@/lib/domain-config";
import { toast } from "sonner";

interface EventQRCodeGeneratorProps {
  eventId?: string;
}

export const EventQRCodeGenerator = ({ eventId }: EventQRCodeGeneratorProps) => {
  const [qrSize, setQrSize] = useState<number>(512);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrSource, setQrSource] = useState<string>("qr_entrance");

  const guestUrl = generateGuestAccessUrl(eventId, qrSource);

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      const qrDataUrl = await generateQRCode(guestUrl, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrDataUrl);
      toast.success("QR Code generated successfully!");
    } catch (error) {
      console.error("QR generation error:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const filename = `college-expo-qr-${qrSize}px.png`;
    downloadQRCode(qrCodeUrl, filename);
    toast.success("QR Code downloaded!");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(guestUrl);
    toast.success("URL copied to clipboard!");
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>College Expo QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              text-align: center;
              font-family: Arial, sans-serif;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 10px;
              color: #059669;
            }
            h2 {
              font-size: 20px;
              margin-bottom: 30px;
              color: #4b5563;
            }
            img {
              max-width: 400px;
              margin: 30px 0;
            }
            .instructions {
              font-size: 18px;
              color: #6b7280;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <h1>🎓 NCRF College Expo</h1>
          <h2>Scan to Explore Colleges</h2>
          <img src="${qrCodeUrl}" alt="QR Code" />
          <div class="instructions">
            Point your camera at this code to access<br/>
            the Houston College Expo Digital Guide
          </div>
          <div class="footer">National College Resources Foundation</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generate Guest Access QR Code
          </CardTitle>
          <CardDescription>
            Create QR codes for attendees to scan and access the College Expo guide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="qr-source">QR Code Type</Label>
              <Select value={qrSource} onValueChange={setQrSource}>
                <SelectTrigger id="qr-source" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr_entrance">🚪 Entrance QR (Main Event)</SelectItem>
                  <SelectItem value="qr_booth">🎪 Booth QR (Individual Exhibitor)</SelectItem>
                  <SelectItem value="qr_flyer">📄 Flyer QR (Physical Marketing)</SelectItem>
                  <SelectItem value="qr_social">📱 Social Media QR</SelectItem>
                  <SelectItem value="qr_checkin">✅ Check-in QR (Registration)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guest-url">Guest Access URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="guest-url"
                  value={guestUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* QR Code Size */}
          <div className="space-y-2">
            <Label>QR Code Size</Label>
            <RadioGroup value={qrSize.toString()} onValueChange={(v) => setQrSize(parseInt(v))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="256" id="size-256" />
                <Label htmlFor="size-256">Small (256px) - For handouts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="512" id="size-512" />
                <Label htmlFor="size-512">Medium (512px) - For posters</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1024" id="size-1024" />
                <Label htmlFor="size-1024">Large (1024px) - For banners</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerateQR} disabled={isGenerating} className="w-full">
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>

          {/* QR Code Preview */}
          {qrCodeUrl && (
            <div className="space-y-4 pt-4 border-t">
              <Label>QR Code Preview</Label>
              <div className="flex justify-center bg-white p-8 rounded-lg">
                <img src={qrCodeUrl} alt="QR Code" className="max-w-full" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button onClick={handlePrint} variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
