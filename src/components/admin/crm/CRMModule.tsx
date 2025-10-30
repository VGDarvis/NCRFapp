import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export function CRMModule() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="glass-premium p-12 text-center max-w-lg">
        <Users className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-3xl font-bold mb-3 text-foreground">CRM Module</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Contact & organization management system
        </p>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          Coming Soon - Phase 2
        </Badge>
      </Card>
    </div>
  );
}
