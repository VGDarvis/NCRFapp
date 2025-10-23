import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegistrationDrawerProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export const RegistrationDrawer = ({
  open,
  onClose,
  eventId,
  eventTitle,
}: RegistrationDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement registration logic in Phase 3
    setTimeout(() => {
      toast.success("Registration submitted successfully!");
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Register for {eventTitle}</SheetTitle>
          <SheetDescription>
            Fill out the form below to register for this event.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
