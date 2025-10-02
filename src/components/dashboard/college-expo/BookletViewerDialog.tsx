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
      <DialogContent className="max-w-[100vw] md:max-w-[95vw] w-full h-screen md:max-h-[95vh] md:h-[95vh] p-0 inset-0 md:inset-auto md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] flex flex-col">
        <DialogHeader className="px-4 md:px-6 pt-3 md:pt-6 pb-2 border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <DialogTitle className="text-base md:text-lg font-semibold line-clamp-1">
              {booklet.title}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="shrink-0 h-8 md:h-9 text-xs md:text-sm"
            >
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Open in New Tab</span>
              <span className="sm:hidden">Open</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="relative w-full flex-1 overflow-hidden">
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
