import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, GraduationCap, DollarSign, Calendar, Shield } from "lucide-react";

interface ResultCardProps {
  type: "school" | "scholarship" | "youth_service";
  data: any;
}

export function ResultCard({ type, data }: ResultCardProps) {
  if (type === "school") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground">{data.school_name}</h3>
              {data.verification_status === "verified" && (
                <Badge variant="default" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
            {data.school_type && (
              <Badge variant="outline" className="mb-2">
                {data.school_type}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {(data.city || data.state) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{[data.city, data.state].filter(Boolean).join(", ")}</span>
            </div>
          )}

          {(data.total_enrollment || data.student_count) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{(data.total_enrollment || data.student_count).toLocaleString()} students</span>
            </div>
          )}

          {data.athletic_division && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{data.athletic_division}</span>
            </div>
          )}
        </div>

        {data.website && (
          <Button variant="outline" className="w-full" asChild>
            <a href={data.website} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </Button>
        )}
      </Card>
    );
  }

  if (type === "scholarship") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground flex-1">{data.scholarship_name}</h3>
          {data.scholarship_amount && (
            <Badge variant="default" className="gap-1">
              <DollarSign className="w-3 h-3" />
              {data.scholarship_amount.toLocaleString()}
            </Badge>
          )}
        </div>

        <div className="space-y-3 mb-4">
          {data.deadline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Deadline: {new Date(data.deadline).toLocaleDateString()}</span>
            </div>
          )}

          {data.eligibility_requirements && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.eligibility_requirements}
            </p>
          )}
        </div>

        {data.application_url && (
          <Button variant="outline" className="w-full" asChild>
            <a href={data.application_url} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
        )}
      </Card>
    );
  }

  if (type === "youth_service") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40">
        <h3 className="text-xl font-bold text-foreground mb-4">{data.organization_name}</h3>

        <div className="space-y-3 mb-4">
          {(data.city || data.state) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{[data.city, data.state].filter(Boolean).join(", ")}</span>
            </div>
          )}

          {data.service_type && (
            <Badge variant="outline">{data.service_type}</Badge>
          )}

          {data.age_range_min && data.age_range_max && (
            <div className="text-sm text-muted-foreground">
              Ages {data.age_range_min} - {data.age_range_max}
            </div>
          )}

          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {data.description}
            </p>
          )}
        </div>

        {data.contact_email && (
          <Button variant="outline" className="w-full" asChild>
            <a href={`mailto:${data.contact_email}`}>
              Contact
            </a>
          </Button>
        )}
      </Card>
    );
  }

  return null;
}
