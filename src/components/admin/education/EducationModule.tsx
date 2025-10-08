import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SchoolsTab } from "./SchoolsTab";
import { YouthServicesTab } from "./YouthServicesTab";
import { VerificationTab } from "./VerificationTab";
import { BulkImportDialog } from "./BulkImportDialog";
import { Upload, ShieldCheck } from "lucide-react";

export function EducationModule() {
  const [activeTab, setActiveTab] = useState("schools");
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Education & Services Database</h1>
          <p className="text-muted-foreground">
            Manage schools, colleges, and youth services for AI search
          </p>
        </div>
        <Button onClick={() => setShowImportDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schools">Schools & Colleges</TabsTrigger>
          <TabsTrigger value="youth-services">Youth Services</TabsTrigger>
          <TabsTrigger value="verification">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verification Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schools">
          <SchoolsTab />
        </TabsContent>

        <TabsContent value="youth-services">
          <YouthServicesTab />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationTab />
        </TabsContent>
      </Tabs>

      <BulkImportDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
}
