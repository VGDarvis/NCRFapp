import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, User } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useSeminarSessions } from "@/hooks/useSeminarSessions";
import { useSeminarMutations } from "@/hooks/useSeminarMutations";
import { SeminarDialog } from "./SeminarDialog";
import { SeminarCSVImporter } from "../events/SeminarCSVImporter";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import { SeedDallasButton } from "./SeedDallasButton";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SeminarSession } from "@/hooks/useSeminarSessions";

export function SeminarsModule() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<SeminarSession | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seminarToDelete, setSeminarToDelete] = useState<string | null>(null);

  const { events, isLoading: eventsLoading } = useEvents();
  const { data: seminars, isLoading: seminarsLoading } = useSeminarSessions(selectedEventId);
  const { deleteSeminar } = useSeminarMutations();

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  const filteredSeminars = seminars?.filter((seminar) => {
    const matchesSearch = seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.presenter_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoom = selectedRoom === "all" || seminar.room?.room_name === selectedRoom;
    return matchesSearch && matchesRoom;
  }) || [];

  const uniqueRooms = Array.from(new Set(seminars?.map((s) => s.room?.room_name).filter(Boolean))) as string[];

  const handleEdit = (seminar: SeminarSession) => {
    setEditingSeminar(seminar);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSeminarToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (seminarToDelete) {
      await deleteSeminar.mutateAsync(seminarToDelete);
      setDeleteDialogOpen(false);
      setSeminarToDelete(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingSeminar(null);
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "test_prep": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "financial_aid": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "college_selection": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "career": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Seminars Management</h2>
        <p className="text-muted-foreground">
          Create and manage seminar sessions for your events
        </p>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Seminars</TabsTrigger>
          <TabsTrigger value="import">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {/* Event Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Event</CardTitle>
              <CardDescription>Choose an event to manage seminars</CardDescription>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - {format(new Date(event.start_at), "MMM d, yyyy")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Seminars List */}
          {selectedEventId && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Seminar Sessions</CardTitle>
                    <CardDescription>
                      {filteredSeminars.length} session{filteredSeminars.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeedDallasButton />
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Seminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search seminars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {uniqueRooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seminars Table */}
                {seminarsLoading ? (
                  <LoadingSpinner />
                ) : filteredSeminars.length === 0 ? (
                  <EmptyState
                    title="No seminars found"
                    description="Create your first seminar or adjust your filters"
                    icon={Calendar}
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredSeminars.map((seminar) => (
                      <div
                        key={seminar.id}
                        className="glass-premium rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{seminar.title}</h3>
                              {seminar.category && (
                                <Badge variant="outline" className={getCategoryColor(seminar.category)}>
                                  {seminar.category.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            {seminar.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {seminar.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(seminar)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(seminar.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(seminar.start_time), "h:mm a")} -{" "}
                              {format(new Date(seminar.end_time), "h:mm a")}
                            </span>
                          </div>
                          {seminar.room && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{seminar.room.room_name}</span>
                            </div>
                          )}
                          {seminar.presenter_name && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              <span>
                                {seminar.presenter_name}
                                {seminar.presenter_organization && ` - ${seminar.presenter_organization}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          {selectedEventId && selectedEvent ? (
            <SeminarCSVImporter
              eventId={selectedEventId}
              venueId={selectedEvent.venue_id || ""}
          eventDate={selectedEvent.start_at}
              onImportComplete={() => {}}
            />
          ) : (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  title="Select an event first"
                  description="Choose an event from the Manage Seminars tab to import seminars"
                  icon={Calendar}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Seminar Dialog */}
      {selectedEvent && (
        <SeminarDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          eventId={selectedEventId}
          venueId={selectedEvent.venue_id || ""}
          eventDate={selectedEvent.start_at}
          seminar={editingSeminar}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seminar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this seminar? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
