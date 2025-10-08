import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolsTab } from "./SchoolsTab";
import { YouthServicesTab } from "./YouthServicesTab";

export function EducationModule() {
  const [activeTab, setActiveTab] = useState("schools");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Education & Services Database</h1>
        <p className="text-muted-foreground">
          Manage schools, colleges, and youth services for AI search
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schools">Schools & Colleges</TabsTrigger>
          <TabsTrigger value="youth-services">Youth Services</TabsTrigger>
        </TabsList>

        <TabsContent value="schools">
          <SchoolsTab />
        </TabsContent>

        <TabsContent value="youth-services">
          <YouthServicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
