import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Building2, MapPin, Globe } from "lucide-react";
import { ExhibitorCSVImporter } from "./ExhibitorCSVImporter";
import { ExhibitorDirectory } from "./ExhibitorDirectory";
import { BoothAssignmentWizard } from "./BoothAssignmentWizard";
import { WebsiteMapIntegration } from "./WebsiteMapIntegration";

export const ExhibitorsModule = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Exhibitor Management</h2>
        <p className="text-muted-foreground">
          Import, manage, and assign exhibitors for college expos
        </p>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="directory" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Directory</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </TabsTrigger>
          <TabsTrigger value="assign" className="gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Assign</span>
          </TabsTrigger>
          <TabsTrigger value="websites" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Websites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <ExhibitorDirectory />
        </TabsContent>

        <TabsContent value="import">
          <ExhibitorCSVImporter />
        </TabsContent>

        <TabsContent value="assign">
          <BoothAssignmentWizard />
        </TabsContent>

        <TabsContent value="websites">
          <WebsiteMapIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
