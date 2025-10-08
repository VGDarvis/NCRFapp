import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("metric-card-hover glass-premium", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-muted-foreground">{title}</CardDescription>
          {Icon && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold text-primary mb-1">{value}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={cn("text-xs mt-2", trend.isPositive ? "text-accent" : "text-destructive")}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
