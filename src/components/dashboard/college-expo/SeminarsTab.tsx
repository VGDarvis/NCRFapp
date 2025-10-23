import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Video, Filter } from "lucide-react";
import { useSeminarSessions } from "@/hooks/useSeminarSessions";
import { format, parseISO, isSameDay } from "date-fns";

interface SeminarsTabProps {
  eventId: string;
}

export const SeminarsTab = ({ eventId }: SeminarsTabProps) => {
  const { data: sessions, isLoading } = useSeminarSessions(eventId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading seminars...</p>
        </Card>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Seminars Scheduled</h3>
          <p className="text-muted-foreground">
            Check back soon for workshop and seminar schedules.
          </p>
        </Card>
      </div>
    );
  }

  const categories = Array.from(new Set(sessions.map(s => s.category).filter(Boolean)));
  const filteredSessions = selectedCategory
    ? sessions.filter(s => s.category === selectedCategory)
    : sessions;

  // Group by day
  const sessionsByDay = filteredSessions.reduce((acc, session) => {
    const day = format(parseISO(session.start_time), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Seminars & Workshops</h1>
        <p className="text-muted-foreground">
          Learn from college admissions experts, financial aid counselors, and more
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category?.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(sessionsByDay).map(([day, daySessions]) => (
          <div key={day}>
            <h2 className="text-xl font-semibold mb-4">
              {format(parseISO(day), "EEEE, MMMM d, yyyy")}
            </h2>
            <div className="grid gap-4">
              {daySessions.map((session) => (
                <Card key={session.id} className="p-6 hover:border-primary transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-32 shrink-0">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          {format(parseISO(session.start_time), "h:mm a")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(session.end_time), "h:mm a")}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
                      
                      {session.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {session.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 mb-3">
                        {session.presenter_name && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Presenter: </span>
                            <span className="font-medium">{session.presenter_name}</span>
                            {session.presenter_title && (
                              <span className="text-muted-foreground">
                                , {session.presenter_title}
                              </span>
                            )}
                            {session.presenter_organization && (
                              <span className="text-muted-foreground">
                                {" "}
                                at {session.presenter_organization}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {session.category && (
                          <Badge variant="secondary">
                            {session.category.replace(/_/g, " ")}
                          </Badge>
                        )}
                        {session.target_audience?.map((audience) => (
                          <Badge key={audience} variant="outline">
                            {audience.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {session.room && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {session.room.room_name}
                            {session.room.room_number && ` (${session.room.room_number})`}
                          </div>
                        )}
                        {session.max_capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Capacity: {session.max_capacity}
                          </div>
                        )}
                        {session.registration_required && (
                          <Badge variant="outline" className="text-xs">
                            Registration Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
