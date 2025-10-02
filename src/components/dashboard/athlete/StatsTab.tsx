import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Target, BookOpen, Plus } from "lucide-react";

export default function StatsTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Performance Dashboard</CardTitle>
          <CardDescription className="text-white/80">
            Track your athletic performance and academic progress
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">--</div>
            <p className="text-xs text-white/70 mt-1">Add your GPA</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              SAT/ACT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">--</div>
            <p className="text-xs text-white/70 mt-1">Add test scores</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0</div>
            <p className="text-xs text-white/70 mt-1">Add accomplishments</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Grad Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">--</div>
            <p className="text-xs text-white/70 mt-1">Set graduation year</p>
          </CardContent>
        </Card>
      </div>

      {/* Athletic Stats */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Athletic Performance</CardTitle>
              <CardDescription className="text-white/80">
                Track your sport-specific statistics and achievements
              </CardDescription>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/70">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Athletic Stats Yet</p>
            <p className="text-sm">Add your sport profile to start tracking performance metrics</p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Progress */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription className="text-white/80">
            Monitor your academic eligibility and core course requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <p className="font-semibold">Core GPA</p>
                <p className="text-sm text-white/70">NCAA Division I Minimum: 2.3</p>
              </div>
              <div className="text-2xl font-bold">--</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <p className="font-semibold">Core Courses Completed</p>
                <p className="text-sm text-white/70">NCAA Required: 16 courses</p>
              </div>
              <div className="text-2xl font-bold">0/16</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <p className="font-semibold">Test Score Status</p>
                <p className="text-sm text-white/70">SAT or ACT required for Division I/II</p>
              </div>
              <div className="text-sm text-amber-400">Pending</div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-white/10 text-white border border-white/20 hover:bg-white/20">
            Update Academic Info
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Athletic Achievements</CardTitle>
              <CardDescription className="text-white/80">
                Showcase your awards, honors, and accomplishments
              </CardDescription>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/70">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Achievements Added</p>
            <p className="text-sm">Add your awards, championships, and recognitions to build your profile</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
