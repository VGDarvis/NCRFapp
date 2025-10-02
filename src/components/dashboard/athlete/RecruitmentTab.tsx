import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, FileText, Video, Calendar, CheckCircle2, Plus } from "lucide-react";

export default function RecruitmentTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Recruitment Center</CardTitle>
          <CardDescription className="text-white/80">
            Manage your college recruitment journey and connect with coaches
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recruitment Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <GraduationCap className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">College Target List</CardTitle>
            <CardDescription className="text-white/70">
              Build and manage your list of target schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Colleges
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <Mail className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Coach Connections</CardTitle>
            <CardDescription className="text-white/70">
              Track communications with college coaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0 Contacts</div>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Add Coach
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Athletic Resume</CardTitle>
            <CardDescription className="text-white/70">
              Create your professional sports resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Build Resume
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <Video className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Video Portfolio</CardTitle>
            <CardDescription className="text-white/70">
              Upload and manage your highlight reels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Upload Video
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Recruiting Timeline</CardTitle>
            <CardDescription className="text-white/70">
              Stay on track with important deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Timeline
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <CheckCircle2 className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Scholarship Tracker</CardTitle>
            <CardDescription className="text-white/70">
              Track scholarship offers and applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0 Offers</div>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Add Offer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Card */}
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle>NCAA Eligibility Center</CardTitle>
          <CardDescription className="text-white/80">
            Stay compliant with NCAA academic and amateurism requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">Register with NCAA Eligibility Center</p>
              <p className="text-sm text-white/70">Required for Division I and II recruitment</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">Track Core Course Requirements</p>
              <p className="text-sm text-white/70">Ensure you meet minimum GPA and course standards</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">Monitor Amateurism Status</p>
              <p className="text-sm text-white/70">Understand rules about endorsements and compensation</p>
            </div>
          </div>
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white mt-4">
            Check Eligibility Status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
