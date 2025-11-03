import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Building2, Users, Calendar, FileText, Sparkles, Activity } from "lucide-react";
import { DashboardTab } from "./DashboardTab";
import { CRMAnalyticsTab } from "./CRMAnalyticsTab";
import { HRAnalyticsTab } from "./HRAnalyticsTab";
import { ProgramAnalyticsTab } from "./ProgramAnalyticsTab";
import { AISearchPanel } from "./AISearchPanel";
import { EventEngagementAnalyticsTab } from "./EventEngagementAnalyticsTab";

export function AnalyticsModule() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights across all modules
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex w-full lg:w-auto overflow-x-auto gap-2 px-1 scrollbar-hide">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 whitespace-nowrap">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2 whitespace-nowrap">
            <Activity className="h-4 w-4" />
            <span>Event Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2 whitespace-nowrap">
            <Calendar className="h-4 w-4" />
            <span>Programs</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-2 whitespace-nowrap">
            <Building2 className="h-4 w-4" />
            <span>Partnerships</span>
          </TabsTrigger>
          <TabsTrigger value="hr" className="flex items-center gap-2 whitespace-nowrap">
            <Users className="h-4 w-4" />
            <span>HR</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="h-4 w-4" />
            <span>AI Search</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 whitespace-nowrap">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <EventEngagementAnalyticsTab />
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <ProgramAnalyticsTab />
        </TabsContent>

        <TabsContent value="crm" className="mt-6">
          <CRMAnalyticsTab />
        </TabsContent>

        <TabsContent value="hr" className="mt-6">
          <HRAnalyticsTab />
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <AISearchPanel />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="glass-premium p-8 rounded-lg text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Report Generator</h3>
            <p className="text-muted-foreground mb-4">
              Coming soon: Custom report builder with scheduled reporting
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
