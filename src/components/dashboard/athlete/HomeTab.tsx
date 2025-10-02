import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, GraduationCap, TrendingUp, LogOut } from "lucide-react";

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

  if (loading) {
    return <div className="text-white text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to SAP, {user?.email?.split('@')[0] || 'Athlete'}!</CardTitle>
          <CardDescription className="text-white/80">
            Your journey to college sports recruitment starts here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/90">
            The Student Athlete Program provides comprehensive support for athletes pursuing college sports opportunities.
            Track your progress, connect with coaches, and prepare for your future.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Profile Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">60%</div>
            <p className="text-xs text-white/70 mt-1">Complete your profile</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              College Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-white/70 mt-1">Start building connections</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-white/70 mt-1">Virtual workshops available</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              GPA Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-white/70 mt-1">Add your academic info</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription className="text-white/80">
            Recommended actions to boost your recruitment profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">1</div>
            <div className="flex-1">
              <h4 className="font-semibold">Complete Your Athletic Profile</h4>
              <p className="text-sm text-white/70">Add your sport, position, stats, and highlight reel</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">2</div>
            <div className="flex-1">
              <h4 className="font-semibold">Register for Virtual Workshop</h4>
              <p className="text-sm text-white/70">Join "Beginning your recruiting journey" on Nov 3rd</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">3</div>
            <div className="flex-1">
              <h4 className="font-semibold">Build Your College List</h4>
              <p className="text-sm text-white/70">Research and add target schools to your recruitment tracker</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
