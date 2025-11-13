import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, User, Sparkles } from "lucide-react";
import { useSeminarSessions, type SeminarSession } from "@/hooks/useSeminarSessions";
import { useSeminarMutations } from "@/hooks/useSeminarMutations";
import { SeminarDialog } from "./SeminarDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { EmptyState } from "../shared/EmptyState";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface StagePerformancesTabProps {
  selectedEventId: string | null;
  venueId: string | null;
  eventDate: string | null;
}

const STAGE_CATEGORIES = {
  entertainment: { label: "Entertainment", icon: "🎭", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
  money_giveaway: { label: "Money Giveaway", icon: "💰", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  scholarship_giveaway: { label: "Scholarship Giveaway", icon: "🎓", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
  stage_performance: { label: "Stage Performance", icon: "⭐", color: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20" },
};

export function StagePerformancesTab({ selectedEventId, venueId, eventDate }: StagePerformancesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState<SeminarSession | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: allSessions, isLoading } = useSeminarSessions(selectedEventId);
  const { deleteSeminar } = useSeminarMutations();

  // Filter to only show stage performance categories
  const stagePerformances = allSessions?.filter(session => 
    session.category && Object.keys(STAGE_CATEGORIES).includes(session.category)
  ) || [];

  // Apply search and type filters
  const filteredPerformances = stagePerformances.filter(performance => {
    const matchesSearch = performance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         performance.presenter_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || performance.category === filterType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (performance: SeminarSession) => {
    setEditingPerformance(performance);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    
    deleteSeminar.mutate(deletingId, {
      onSuccess: () => {
        toast.success("Stage performance deleted successfully");
        setDeleteDialogOpen(false);
        setDeletingId(null);
      },
      onError: () => {
        toast.error("Failed to delete stage performance");
      }
    });
  };

  const getCategoryBadge = (category: string | null) => {
    if (!category || !(category in STAGE_CATEGORIES)) {
      return <Badge variant="outline">Other</Badge>;
    }
    
    const config = STAGE_CATEGORIES[category as keyof typeof STAGE_CATEGORIES];
    return (
      <Badge variant="outline" className={config.color}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Entertainment Hour callout */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Entertainment Hour & Stage Performances</CardTitle>
          </div>
          <CardDescription>
            Manage the grand finale events including giveaways, entertainment, and scholarship announcements. 
            These special moments are a cherished tradition that brings our community together.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <Input
            placeholder="Search performances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(STAGE_CATEGORIES).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.icon} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditingPerformance(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Performance
        </Button>
      </div>

      {/* Performances Grid */}
      {filteredPerformances.length === 0 ? (
        <EmptyState
          title="No stage performances yet"
          description="Add entertainment segments, giveaways, and special performances to make your event unforgettable."
          icon={Sparkles}
          actionLabel="Add First Performance"
          onAction={() => { setEditingPerformance(null); setDialogOpen(true); }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPerformances.map((performance) => (
            <Card key={performance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(performance.category)}
                    </div>
                    <CardTitle className="text-lg">{performance.title}</CardTitle>
                    {performance.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {performance.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(performance)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(performance.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(performance.start_time), "h:mm a")} -{" "}
                    {format(new Date(performance.end_time), "h:mm a")}
                  </span>
                </div>
                {performance.room && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{performance.room.room_name}</span>
                  </div>
                )}
                {performance.presenter_name && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      {performance.presenter_name}
                      {performance.presenter_title && ` • ${performance.presenter_title}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      {selectedEventId && venueId && eventDate && (
        <SeminarDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingPerformance(null);
          }}
          eventId={selectedEventId}
          venueId={venueId}
          eventDate={eventDate}
          seminar={editingPerformance}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stage Performance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this performance? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
