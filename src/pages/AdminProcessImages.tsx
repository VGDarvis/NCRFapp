import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { removeBackground, loadImage } from "@/lib/image-processing";
import { toast } from "sonner";

const PRODUCT_IMAGES = [
  "hbcu-grey-shirt.png",
  "hbcu-grey-shirt-back.png",
  "hbcu-grey-shirt-side.png",
  "hbcu-grey-shirt-detail.png",
  "hbcu-black-shirt-2.png",
  "hbcu-black-shirt-2-back.png",
  "hbcu-black-shirt-2-side.png",
  "hbcu-black-shirt-2-detail.png",
  "hbcu-camo-shirt.png",
  "hbcu-camo-shirt-back.png",
  "hbcu-camo-shirt-side.png",
  "hbcu-camo-shirt-detail.png",
  "ncrf-black-shirt-2.png",
  "ncrf-black-shirt-2-back.png",
  "ncrf-black-shirt-2-side.png",
  "ncrf-black-shirt-2-detail.png",
  "black-hoodie-2.png",
  "black-hoodie-2-back.png",
  "black-hoodie-2-side.png",
  "black-hoodie-2-detail.png",
  "black-shirt-1.png",
  "bce-black-shirt.png",
  "ncrf-black-shirt.png",
  "steam-black-shirt.png",
  "grey-shirt.png",
  "red-shirt.png",
];

interface ProcessedImage {
  original: string;
  processed: string | null;
  status: "pending" | "processing" | "complete" | "error";
  error?: string;
}

export default function AdminProcessImages() {
  const navigate = useNavigate();
  const [images, setImages] = useState<ProcessedImage[]>(
    PRODUCT_IMAGES.map((name) => ({
      original: name,
      processed: null,
      status: "pending" as const,
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (imageName: string, index: number) => {
    try {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, status: "processing" as const } : img
        )
      );

      // Load the image from assets
      const response = await fetch(`/src/assets/shop/${imageName}`);
      const blob = await response.blob();
      const imageElement = await loadImage(blob);

      // Remove background
      const processedBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(processedBlob);

      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? { ...img, processed: processedUrl, status: "complete" as const }
            : img
        )
      );

      return processedBlob;
    } catch (error) {
      console.error(`Error processing ${imageName}:`, error);
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : img
        )
      );
      throw error;
    }
  };

  const processAllImages = async () => {
    setIsProcessing(true);
    toast.info("Starting background removal for all images...");

    for (let i = 0; i < images.length; i++) {
      setCurrentIndex(i);
      try {
        await processImage(images[i].original, i);
        toast.success(`Processed: ${images[i].original}`);
      } catch (error) {
        toast.error(`Failed: ${images[i].original}`);
      }
    }

    setIsProcessing(false);
    toast.success("All images processed!");
  };

  const downloadImage = (imageName: string, processedUrl: string) => {
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = imageName.replace(".png", "-transparent.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded: ${link.download}`);
  };

  const downloadAll = () => {
    images
      .filter((img) => img.processed)
      .forEach((img) => {
        setTimeout(() => downloadImage(img.original, img.processed!), 100);
      });
  };

  const progress = (images.filter((img) => img.status === "complete").length / images.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/shop")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
          <h1 className="text-3xl font-bold">Image Background Removal</h1>
          <div className="w-32" />
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8 glass-dark border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Progress: {images.filter((img) => img.status === "complete").length} /{" "}
                {images.length}
              </p>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={processAllImages}
                disabled={isProcessing}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isProcessing ? "Processing..." : "Process All"}
              </Button>
              <Button
                onClick={downloadAll}
                variant="outline"
                disabled={!images.some((img) => img.processed)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>
        </Card>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card
              key={image.original}
              className={`p-4 glass-dark border-gray-800 ${
                currentIndex === index && isProcessing ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="space-y-4">
                {/* Original Image */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Original</p>
                  <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={`/src/assets/shop/${image.original}`}
                      alt={image.original}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Processed ({image.status})
                  </p>
                  <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden grid-pattern">
                    {image.processed ? (
                      <img
                        src={image.processed}
                        alt={`${image.original} - transparent`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        {image.status === "processing" ? "Processing..." : "Not processed"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {image.error && (
                  <p className="text-xs text-destructive">{image.error}</p>
                )}

                {/* Download Button */}
                {image.processed && (
                  <Button
                    onClick={() => downloadImage(image.original, image.processed!)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
