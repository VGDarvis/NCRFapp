import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { Calendar, MapPin, Image, BookOpen, LayoutGrid, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "../shared/EmptyState";
import { EventFlyerUploadDialog } from "../events/EventFlyerUploadDialog";

interface EventManagementPanelProps {
  onNavigate: (tab: string) => void;
}

export function EventManagementPanel({ onNavigate }: EventManagementPanelProps) {
  const { activeEvent, isLoading } = useActiveEvent();
  const [flyerDialogOpen, setFlyerDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="glass-premium">
        <CardHeader>
          <CardTitle>Current Event</CardTitle>
          <CardDescription>Manage the active event shown to users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse glass-medium rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!activeEvent) {
    return (
      <Card className="glass-premium">
        <CardHeader>
          <CardTitle>Current Event</CardTitle>
          <CardDescription>Manage the active event shown to users</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Calendar}
            title="No Active Event"
            description="Create an upcoming event to get started"
          />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => onNavigate("expos")} className="action-button">
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "in_progress":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="glass-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Active Event</CardTitle>
            <CardDescription>This is what users see on their dashboard</CardDescription>
          </div>
          <Badge variant={getStatusColor(activeEvent.status)} className="text-xs capitalize">
            {activeEvent.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Details */}
        <div className="glass-medium p-4 rounded-lg border border-primary/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">{activeEvent.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(activeEvent.start_at), "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
                {activeEvent.venue && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{activeEvent.venue.name} - {activeEvent.venue.city}, {activeEvent.venue.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-premium p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{activeEvent.booth_count}</div>
              <div className="text-xs text-muted-foreground mt-1">Booths</div>
            </div>
            <div className="glass-premium p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{activeEvent.seminar_count}</div>
              <div className="text-xs text-muted-foreground mt-1">Seminars</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <Button
              variant="outline"
              onClick={() => setFlyerDialogOpen(true)}
              className="action-button justify-start"
            >
              <Image className="w-4 h-4 mr-2" />
              Update Flyer
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("seminars")}
              className="action-button justify-start"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Seminars
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("expos")}
              className="action-button justify-start"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Edit Floor Plan
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("expos")}
              className="action-button justify-start"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch Event
            </Button>
            <Button
              onClick={() => onNavigate("expos")}
              className="action-button justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      </CardContent>
      
      <EventFlyerUploadDialog 
        open={flyerDialogOpen}
        onOpenChange={setFlyerDialogOpen}
        eventId={activeEvent.id}
      />
    </Card>
  );
}
