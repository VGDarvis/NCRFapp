import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MessageSquare, Tag } from "lucide-react";
import { CRMStatsWidget } from "./CRMStatsWidget";
import { OrganizationsTab } from "./OrganizationsTab";
import { ContactsTab } from "./ContactsTab";
import { InteractionsTab } from "./InteractionsTab";

export function CRMModule() {
  const [activeTab, setActiveTab] = useState("organizations");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">CRM</h2>
        <p className="text-muted-foreground">
          Manage partnerships, contacts, and outreach interactions
        </p>
      </div>

      <CRMStatsWidget />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-medium">
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="w-4 h-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="w-4 h-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="interactions" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <OrganizationsTab />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <ContactsTab />
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <InteractionsTab />
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <div className="glass-premium rounded-lg p-8 text-center">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tags Coming Soon</h3>
            <p className="text-muted-foreground">
              Tag management will be available in a future update
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
