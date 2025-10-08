import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRStatsWidget } from "./HRStatsWidget";
import { EmployeesTab } from "./EmployeesTab";
import { DepartmentsTab } from "./DepartmentsTab";
import { OnboardingTab } from "./OnboardingTab";
import { DocumentsTab } from "./DocumentsTab";

export function HRModule() {
  const [activeTab, setActiveTab] = useState("employees");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">HR Management</h1>
        <p className="text-muted-foreground">
          Manage employees, departments, onboarding, and documentation
        </p>
      </div>

      <HRStatsWidget />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <EmployeesTab />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingTab />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
