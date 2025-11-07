import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSeminarMutations } from "@/hooks/useSeminarMutations";
import { Loader2 } from "lucide-react";
import type { SeminarSession } from "@/hooks/useSeminarSessions";

interface SeminarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  venueId: string;
  eventDate: string;
  seminar?: SeminarSession | null;
}

export function SeminarDialog({
  open,
  onOpenChange,
  eventId,
  venueId,
  eventDate,
  seminar,
}: SeminarDialogProps) {
  const { createSeminar, updateSeminar } = useSeminarMutations();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    presenter_name: "",
    presenter_title: "",
    presenter_organization: "",
    start_time: "",
    end_time: "",
    room_name: "",
    category: "general",
    max_capacity: "",
    registration_required: false,
  });

  useEffect(() => {
    if (seminar) {
      // Parse UTC time to local HH:MM format for input
      const startDate = new Date(seminar.start_time);
      const endDate = new Date(seminar.end_time);
      
      // Format as HH:MM in local timezone
      const startTime = startDate.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const endTime = endDate.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setFormData({
        title: seminar.title || "",
        description: seminar.description || "",
        presenter_name: seminar.presenter_name || "",
        presenter_title: seminar.presenter_title || "",
        presenter_organization: seminar.presenter_organization || "",
        start_time: startTime,
        end_time: endTime,
        room_name: seminar.room?.room_name || "",
        category: seminar.category || "general",
        max_capacity: seminar.max_capacity?.toString() || "",
        registration_required: seminar.registration_required || false,
      });
    } else {
      // Reset form for new seminar
      setFormData({
        title: "",
        description: "",
        presenter_name: "",
        presenter_title: "",
        presenter_organization: "",
        start_time: "",
        end_time: "",
        room_name: "",
        category: "general",
        max_capacity: "",
        registration_required: false,
      });
    }
  }, [seminar, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate times
    if (formData.start_time >= formData.end_time) {
      return;
    }

    // Extract date and create proper Date objects in local timezone
    const eventDateObj = new Date(eventDate);
    const [startHour, startMinute] = formData.start_time.split(':').map(Number);
    const [endHour, endMinute] = formData.end_time.split(':').map(Number);
    
    // Create dates in local timezone
    const startDate = new Date(eventDateObj);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(eventDateObj);
    endDate.setHours(endHour, endMinute, 0, 0);
    
    // Convert to ISO strings (which will be in UTC)
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();

    const payload = {
      event_id: eventId,
      venue_id: venueId,
      title: formData.title,
      description: formData.description || undefined,
      presenter_name: formData.presenter_name || undefined,
      presenter_title: formData.presenter_title || undefined,
      presenter_organization: formData.presenter_organization || undefined,
      start_time: startDateTime,
      end_time: endDateTime,
      room_name: formData.room_name,
      category: formData.category || undefined,
      max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : undefined,
      registration_required: formData.registration_required,
    };

    if (seminar) {
      await updateSeminar.mutateAsync({ ...payload, id: seminar.id });
    } else {
      await createSeminar.mutateAsync(payload);
    }

    // Small delay to ensure query refetch completes
    await new Promise(resolve => setTimeout(resolve, 150));
    onOpenChange(false);
  };

  const isLoading = createSeminar.isPending || updateSeminar.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{seminar ? "Edit Seminar" : "Create New Seminar"}</DialogTitle>
          <DialogDescription>
            {seminar ? "Update seminar details" : "Add a new seminar session to the event"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Seminar title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_name">Location/Room *</Label>
            <Input
              id="room_name"
              required
              value={formData.room_name}
              onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
              placeholder="e.g., Main Hall, Room 101"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="test_prep">Test Preparation</SelectItem>
                <SelectItem value="financial_aid">Financial Aid</SelectItem>
                <SelectItem value="college_selection">College Selection</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="presenter_name">Presenter Name</Label>
            <Input
              id="presenter_name"
              value={formData.presenter_name}
              onChange={(e) => setFormData({ ...formData, presenter_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="presenter_title">Presenter Title</Label>
              <Input
                id="presenter_title"
                value={formData.presenter_title}
                onChange={(e) => setFormData({ ...formData, presenter_title: e.target.value })}
                placeholder="Director"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presenter_organization">Organization</Label>
              <Input
                id="presenter_organization"
                value={formData.presenter_organization}
                onChange={(e) => setFormData({ ...formData, presenter_organization: e.target.value })}
                placeholder="University Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_capacity">Max Capacity</Label>
            <Input
              id="max_capacity"
              type="number"
              min="1"
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
              placeholder="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Seminar description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {seminar ? "Update Seminar" : "Create Seminar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
