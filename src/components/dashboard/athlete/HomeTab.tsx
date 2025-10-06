import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, GraduationCap, TrendingUp, LogOut } from "lucide-react";
import { EventHero } from './EventHero';
import { EventSchedule } from './EventSchedule';
import { EventActivities } from './EventActivities';

export default function HomeTab() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const featuredEvent = {
    title: "Virtual Recruiting Seminars",
    eventDate: "2024-11-03T15:00:00-08:00",
    locationName: "Virtual Event (Zoom)",
    description: "Your journey to playing at the collegiate level. Join our comprehensive 4-part workshop series designed to guide student athletes through every step of the recruiting process. Learn from expert coaches and recruiters about NCAA eligibility, building your recruiting profile, connecting with college programs, and successfully navigating scholarship opportunities.",
    registrationLink: "https://ncrfoundation.org",
    isFree: true,
  };

  const workshopSchedule = [
    { time: "Nov 3rd, 3pm-5pm PST", activity: "SESSION 1: Beginning your recruiting journey" },
    { time: "Dec 8th, 3pm-5pm PST", activity: "SESSION 2: Are you a '5 star athlete?'" },
    { time: "Jan 5th, 3pm-5pm PST", activity: "SESSION 3: Are you prepared: eligibility & academics" },
    { time: "Feb 9th, 3pm-5pm PST", activity: "SESSION 4: Sealing the deal: Advocate for yourself" },
  ];

  const eventActivities = [
    "Virtual Workshops",
    "NCAA Eligibility Guidance",
    "Recruiting Resources",
    "College Planning Support",
  ];

  if (loading) {
    return <div className="text-white text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Featured Event Hero */}
      <EventHero event={featuredEvent} />

      {/* Event Details Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <EventSchedule schedule={workshopSchedule} eventDate={featuredEvent.eventDate} />
        <EventActivities activities={eventActivities} />
      </div>

      {/* Welcome Section */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Welcome to SAP, {user?.email?.split('@')[0] || 'Athlete'}!</CardTitle>
          <CardDescription className="text-white/80">
            Your journey to college sports recruitment starts here
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">60%</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
          </CardContent>
        </Card>
      </div>

      {/* Sign Out Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/signout')}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out →
        </Button>
      </div>
    </div>
  );
}
