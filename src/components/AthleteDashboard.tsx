import { useState } from "react";
import { Trophy, Target, GraduationCap, Calendar, BarChart3, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeTab from "./dashboard/athlete/HomeTab";
import SportsTab from "./dashboard/athlete/SportsTab";
import RecruitmentTab from "./dashboard/athlete/RecruitmentTab";
import WorkshopsTab from "./dashboard/athlete/WorkshopsTab";
import StatsTab from "./dashboard/athlete/StatsTab";
import CommunityTab from "./dashboard/athlete/CommunityTab";
import logoAthlete from "@/assets/logo-athlete.png";

export function AthleteDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-amber-400">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoAthlete} alt="SAP Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-white font-bold text-xl">Student Athlete Program</h1>
              <p className="text-white/80 text-sm">Your Path to College Sports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pb-24 md:pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-6 bg-black/20 backdrop-blur-sm border border-white/10 mb-6">
            <TabsTrigger value="home" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
              <Trophy className="mr-2 h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="sports" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
              <Target className="mr-2 h-4 w-4" />
              Sports
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
              <GraduationCap className="mr-2 h-4 w-4" />
              Recruitment
            </TabsTrigger>
            <TabsTrigger value="workshops" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
              <Calendar className="mr-2 h-4 w-4" />
              Workshops
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
              <BarChart3 className="mr-2 h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 backdrop-blur-lg">
        <div className="grid grid-cols-6 gap-1 p-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "home" ? "bg-amber-500 text-white" : "text-white/70"
            }`}
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("sports")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "sports" ? "bg-amber-500 text-white" : "text-white/70"
            }`}
          >
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs">Sports</span>
          </button>
          <button
            onClick={() => setActiveTab("recruitment")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "recruitment" ? "bg-amber-500 text-white" : "text-white/70"
            }`}
          >
            <GraduationCap className="h-5 w-5 mb-1" />
            <span className="text-xs">Recruit</span>
          </button>
          <button
            onClick={() => setActiveTab("workshops")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "workshops" ? "bg-amber-500 text-white" : "text-white/70"
            }`}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Events</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "stats" ? "bg-amber-500 text-white" : "text-white/70"
            }`}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeTab === "community" ? "bg-amber-500 text-white" : "text-white/70"
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
