import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Send, FileText, Calendar, DollarSign, Upload } from "lucide-react";

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export function QuickActionsPanel({ onAction }: QuickActionsProps) {
  const actions = [
    { id: "add-employee", label: "Add Employee", icon: UserPlus, variant: "default" as const },
    { id: "send-campaign", label: "Send Campaign", icon: Send, variant: "default" as const },
    { id: "create-report", label: "Create Report", icon: FileText, variant: "outline" as const },
    { id: "schedule-meeting", label: "Schedule Meeting", icon: Calendar, variant: "outline" as const },
    { id: "process-payroll", label: "Process Payroll", icon: DollarSign, variant: "outline" as const },
    { id: "import-contacts", label: "Import Contacts", icon: Upload, variant: "outline" as const },
  ];

  return (
    <Card className="glass-premium">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={() => onAction?.(action.id)}
                className="action-button h-auto py-3 justify-start"
              >
                <Icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
