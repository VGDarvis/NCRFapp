import { X, Share2, MapPin, Calendar, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface EventDrawerContent {
  type: "event";
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  flyerUrl?: string;
  tags?: Array<{ tag: { name: string } }>;
}

interface BoothDrawerContent {
  type: "booth";
  id: string;
  sponsor: {
    name: string;
    logo_url: string | null;
    website_url: string | null;
    contact_email: string | null;
    tier: string | null;
  };
  booth_number: string | null;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

type DrawerContent = EventDrawerContent | BoothDrawerContent;

interface MapCardDrawerProps {
  open: boolean;
  onClose: () => void;
  content: DrawerContent | null;
  onRegister?: () => void;
  onAddToSchedule?: () => void;
}

export const MapCardDrawer = ({
  open,
  onClose,
  content,
  onRegister,
  onAddToSchedule,
}: MapCardDrawerProps) => {
  if (!content) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>
              {content.type === "event" ? content.title : content.sponsor.name}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {content.type === "event" ? (
              <>
                {content.flyerUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={content.flyerUrl}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(content.start_at), "MMMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(content.start_at), "h:mm a")} -{" "}
                        {format(new Date(content.end_at), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {content.venue && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{content.venue.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {content.venue.address}
                          <br />
                          {content.venue.city}, {content.venue.state}
                        </p>
                      </div>
                    </div>
                  )}

                  {content.description && (
                    <p className="text-sm text-muted-foreground">
                      {content.description}
                    </p>
                  )}

                  {content.tags && content.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tagObj, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tagObj.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  {onRegister && (
                    <Button className="w-full" onClick={onRegister}>
                      Register for Event
                    </Button>
                  )}
                  {onAddToSchedule && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onAddToSchedule}
                    >
                      Add to My Schedule
                    </Button>
                  )}
                  {content.venue && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const address = `${content.venue!.address}, ${
                          content.venue!.city
                        }, ${content.venue!.state}`;
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            address
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                {content.sponsor.logo_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={content.sponsor.logo_url}
                      alt={content.sponsor.name}
                      className="max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {content.sponsor.tier && (
                      <Badge variant="secondary" className="capitalize">
                        {content.sponsor.tier} Sponsor
                      </Badge>
                    )}
                    {content.booth_number && (
                      <Badge variant="outline">Booth {content.booth_number}</Badge>
                    )}
                  </div>

                  {content.description && (
                    <div>
                      <p className="text-sm font-medium mb-2">About:</p>
                      <p className="text-sm text-muted-foreground">
                        {content.description}
                      </p>
                    </div>
                  )}

                  {(content.contact_email || content.sponsor.contact_email) && (
                    <div>
                      <p className="text-sm font-medium mb-1">Contact:</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {content.contact_name && <p>{content.contact_name}</p>}
                        <p>{content.contact_email || content.sponsor.contact_email}</p>
                        {content.contact_phone && <p>{content.contact_phone}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  {content.sponsor.website_url && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        window.open(content.sponsor.website_url!, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {onAddToSchedule && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onAddToSchedule}
                    >
                      Add to My Schedule
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
