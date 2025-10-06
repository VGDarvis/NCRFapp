import { useState } from "react";
import { Trophy, Target, GraduationCap, Calendar, BarChart3, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeTab from "./dashboard/athlete/HomeTab";
import SportsTab from "./dashboard/athlete/SportsTab";
import RecruitmentTab from "./dashboard/athlete/RecruitmentTab";
import WorkshopsTab from "./dashboard/athlete/WorkshopsTab";
import StatsTab from "./dashboard/athlete/StatsTab";
import CommunityTab from "./dashboard/athlete/CommunityTab";
import { DashboardHeader } from "./DashboardHeader";
import logoAthlete from "@/assets/logo-athlete.png";

interface AthleteDashboardProps {
  isGuest?: boolean;
}

export function AthleteDashboard({ isGuest = false }: AthleteDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-background">
      {/* Header */}
      <DashboardHeader
        logo={logoAthlete}
        logoAlt="Student Athlete Program"
        title="Student Athlete Program"
        subtitle="Your Path to College Sports"
        isGuest={isGuest}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pb-24 md:pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-6 glass-premium border border-primary/20 mb-6">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Trophy className="mr-2 h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="sports" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Target className="mr-2 h-4 w-4" />
              Sports
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <GraduationCap className="mr-2 h-4 w-4" />
              Recruitment
            </TabsTrigger>
            <TabsTrigger value="workshops" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Workshops
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <BarChart3 className="mr-2 h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Users className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="home" className="mt-0">
            <HomeTab />
          </TabsContent>
          <TabsContent value="sports" className="mt-0">
            <SportsTab />
          </TabsContent>
          <TabsContent value="recruitment" className="mt-0">
            <RecruitmentTab />
          </TabsContent>
          <TabsContent value="workshops" className="mt-0">
            <WorkshopsTab />
          </TabsContent>
          <TabsContent value="stats" className="mt-0">
            <StatsTab />
          </TabsContent>
          <TabsContent value="community" className="mt-0">
            <CommunityTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-premium border-t border-primary/20 backdrop-blur-lg">
        <div className="grid grid-cols-6 gap-1 p-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "home" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("sports")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "sports" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs">Sports</span>
          </button>
          <button
            onClick={() => setActiveTab("recruitment")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "recruitment" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <GraduationCap className="h-5 w-5 mb-1" />
            <span className="text-xs">Recruit</span>
          </button>
          <button
            onClick={() => setActiveTab("workshops")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "workshops" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Events</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "stats" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "community" ? "bg-primary/30 text-primary" : "text-muted-foreground"
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Network</span>
          </button>
        </div>
      </div>
    </div>
  );
}
