import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, ExternalLink, Phone, Mail, CheckCircle2, X } from "lucide-react";
import { Booth } from "@/hooks/useBooths";

interface BoothDetailDrawerProps {
  booth: Booth;
  open: boolean;
  onClose: () => void;
  isFavorite: boolean;
  hasVisited: boolean;
  onToggleFavorite: () => void;
  onCheckIn: () => void;
}

export const BoothDetailDrawer = ({
  booth,
  open,
  onClose,
  isFavorite,
  hasVisited,
  onToggleFavorite,
  onCheckIn,
}: BoothDetailDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-start gap-4 mb-4">
            {booth.logo_url && (
              <img
                src={booth.logo_url}
                alt={booth.org_name}
                className="w-20 h-20 object-contain rounded-lg border bg-white"
              />
            )}
            <div className="flex-1">
              <DrawerTitle className="text-2xl mb-2">{booth.org_name}</DrawerTitle>
              {booth.table_no && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Table {booth.table_no}</span>
                  {booth.zone && <span>• Zone {booth.zone}</span>}
                  {booth.floor_number && <span>• Floor {booth.floor_number}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {booth.org_type && <Badge variant="secondary">{booth.org_type}</Badge>}
            {booth.sponsor_tier && <Badge variant="outline">{booth.sponsor_tier}</Badge>}
            {booth.offers_on_spot_admission && (
              <Badge className="bg-success text-success-foreground">On-Spot Admission</Badge>
            )}
            {booth.waives_application_fee && (
              <Badge className="bg-info text-info-foreground">Fee Waiver Available</Badge>
            )}
            {hasVisited && (
              <Badge className="bg-primary text-primary-foreground gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Visited
              </Badge>
            )}
          </div>

          {booth.description && (
            <DrawerDescription className="text-base">{booth.description}</DrawerDescription>
          )}
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[50vh]">
          {booth.scholarship_info && (
            <div>
              <h4 className="font-semibold mb-2">Scholarship Information</h4>
              <p className="text-sm text-muted-foreground">{booth.scholarship_info}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Contact Information</h4>
            {booth.contact_name && (
              <p className="text-sm">
                <span className="text-muted-foreground">Representative:</span> {booth.contact_name}
              </p>
            )}
            {booth.contact_email && (
              <a
                href={`mailto:${booth.contact_email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                {booth.contact_email}
              </a>
            )}
            {booth.contact_phone && (
              <a
                href={`tel:${booth.contact_phone}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                {booth.contact_phone}
              </a>
            )}
            {booth.website_url && (
              <a
                href={booth.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>
        </div>

        <DrawerFooter className="flex-row gap-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            className="flex-1 gap-2"
            onClick={onToggleFavorite}
          >
            <Star className={isFavorite ? "fill-current" : ""} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
          {!hasVisited && (
            <Button variant="secondary" className="flex-1 gap-2" onClick={onCheckIn}>
              <CheckCircle2 className="w-4 h-4" />
              Check In
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
