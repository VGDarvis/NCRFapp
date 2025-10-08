import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./MessagesTab";
import { CampaignsTab } from "./CampaignsTab";
import { TemplatesTab } from "./TemplatesTab";
import { MessageComposer } from "./MessageComposer";
import { CampaignStatsWidget } from "./CampaignStatsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MessagesModule() {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages & Campaigns</h2>
        <p className="text-muted-foreground">
          Manage your outreach messages, campaigns, and templates
        </p>
      </div>

      <CampaignStatsWidget />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Messages</CardTitle>
              <CardDescription>
                View and manage all sent, scheduled, and draft messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>
                Create and manage bulk messaging campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>
                Create and manage reusable message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <MessageComposer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
