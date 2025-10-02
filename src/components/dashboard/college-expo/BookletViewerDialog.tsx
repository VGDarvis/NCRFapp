import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BookletViewerDialogProps {
  booklet: {
    id: string;
    title: string;
    viewer_url: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookletViewerDialog = ({ booklet, open, onOpenChange }: BookletViewerDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!booklet || !booklet.viewer_url) return null;

  const handleOpenInNewTab = () => {
    if (booklet.viewer_url) {
      window.open(booklet.viewer_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-semibold line-clamp-1">
              {booklet.title}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="shrink-0"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </DialogHeader>
        
        <div className="relative w-full h-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Loading booklet viewer...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={booklet.viewer_url}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title={`${booklet.title} Viewer`}
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
