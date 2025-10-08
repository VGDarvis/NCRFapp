import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Users, GraduationCap, DollarSign, Calendar, Shield, Building2, CheckCircle2, Clock } from "lucide-react";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { format } from "date-fns";

interface AdminResultCardProps {
  type: "school" | "scholarship" | "youth_service";
  data: any;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export function AdminResultCard({ type, data, isSelected, onSelect }: AdminResultCardProps) {
  const { addSchoolToCRM, checkIfInCRM, isAddingToCRM } = useCRMIntegration();
  const isInCRM = checkIfInCRM(data.id);

  const handleAddToCRM = async () => {
    if (type === "school") {
      await addSchoolToCRM(data);
    }
  };

  // Calculate data completeness
  const calculateCompleteness = () => {
    if (type !== "school") return 100;
    
    const fields = [
      data.school_name,
      data.city,
      data.state,
      data.website,
      data.contact_email,
      data.total_enrollment || data.student_count,
      data.school_type,
    ];
    
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  if (type === "school") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40 relative">
        <div className="absolute top-4 right-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </div>

        <div className="flex items-start justify-between mb-4 pr-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-foreground">{data.school_name}</h3>
              {data.verification_status === "verified" && (
                <Badge variant="default" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              {isInCRM && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  In CRM
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

        <div className="space-y-2 mb-4">
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

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Updated: {data.updated_at ? format(new Date(data.updated_at), 'MMM d, yyyy') : 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{completeness}% complete</span>
          </div>
        </div>

        <div className="flex gap-2">
          {data.website && (
            <Button variant="outline" className="flex-1" size="sm" asChild>
              <a href={data.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </Button>
          )}
          <Button
            variant={isInCRM ? "secondary" : "default"}
            className="flex-1"
            size="sm"
            onClick={handleAddToCRM}
            disabled={isInCRM || isAddingToCRM}
          >
            <Building2 className="w-4 h-4 mr-2" />
            {isInCRM ? "In CRM" : isAddingToCRM ? "Adding..." : "Add to CRM"}
          </Button>
        </div>
      </Card>
    );
  }

  if (type === "scholarship") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40 relative">
        <div className="absolute top-4 right-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </div>

        <div className="flex items-start justify-between mb-4 pr-8">
          <h3 className="text-xl font-bold text-foreground flex-1">{data.scholarship_name}</h3>
          {data.scholarship_amount && (
            <Badge variant="default" className="gap-1">
              <DollarSign className="w-3 h-3" />
              ${data.scholarship_amount.toLocaleString()}
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
          <Button variant="outline" className="w-full" size="sm" asChild>
            <a href={data.application_url} target="_blank" rel="noopener noreferrer">
              View Details
            </a>
          </Button>
        )}
      </Card>
    );
  }

  if (type === "youth_service") {
    return (
      <Card className="p-6 glass-premium hover:shadow-elegant transition-all duration-300 border-border/40 hover:border-primary/40 relative">
        <div className="absolute top-4 right-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-4 pr-8">{data.organization_name}</h3>

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

        <div className="flex gap-2">
          {data.contact_email && (
            <Button variant="outline" className="flex-1" size="sm" asChild>
              <a href={`mailto:${data.contact_email}`}>
                Contact
              </a>
            </Button>
          )}
          <Button
            variant="default"
            className="flex-1"
            size="sm"
            onClick={handleAddToCRM}
            disabled={isInCRM || isAddingToCRM}
          >
            <Building2 className="w-4 h-4 mr-2" />
            {isInCRM ? "In CRM" : "Add to CRM"}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
