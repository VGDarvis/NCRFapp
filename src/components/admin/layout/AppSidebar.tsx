import { LayoutDashboard, Users, Calendar, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Overview & metrics"
  },
  { 
    id: "expos", 
    label: "Expos", 
    icon: Calendar,
    description: "Floor plans & booth management"
  },
  { 
    id: "crm", 
    label: "CRM", 
    icon: Users,
    description: "Contacts & organizations"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    icon: BarChart3,
    description: "Reports & insights"
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings,
    description: "Configuration"
  },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/20">
      <SidebarContent className="glass-premium">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/80">
            {open && "Admin Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "transition-all",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive && "animate-glow-pulse")} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
