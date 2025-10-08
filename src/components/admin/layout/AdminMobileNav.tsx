import { LayoutDashboard, Users, MessageSquare, Briefcase, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crm", label: "CRM", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "hr", label: "HR", icon: Briefcase },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminMobileNav({ activeTab, onTabChange }: AdminMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-premium border-t border-primary/20 md:hidden">
      <div className="grid grid-cols-6 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-glow-pulse")} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
