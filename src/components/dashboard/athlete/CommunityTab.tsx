import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Star, Lightbulb, Trophy, TrendingUp } from "lucide-react";

const successStories = [
  {
    name: "Marcus Johnson",
    sport: "Basketball",
    achievement: "Full scholarship to Howard University",
    quote: "The SAP workshops taught me how to advocate for myself and sealed my scholarship deal."
  },
  {
    name: "Aisha Williams",
    sport: "Track & Field",
    achievement: "Division I offer from Florida A&M",
    quote: "Building my college list through SAP helped me find the perfect fit academically and athletically."
  },
  {
    name: "Jamal Patterson",
    sport: "Football",
    achievement: "Starting QB at Morehouse College",
    quote: "The recruiting timeline kept me organized and helped me meet every important deadline."
  }
];

export default function CommunityTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">SAP Community</CardTitle>
          <CardDescription className="text-white/80">
            Connect with fellow student-athletes, share experiences, and learn from success stories
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Community Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Peer Network</CardTitle>
            <CardDescription className="text-white/70">
              Connect with other student-athletes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">500+ Athletes</div>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Join Network
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <MessageCircle className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Discussion Forums</CardTitle>
            <CardDescription className="text-white/70">
              Ask questions and share advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">12 Active Topics</div>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Forums
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
          <CardHeader>
            <Star className="h-8 w-8 mb-2 text-amber-400" />
            <CardTitle className="text-lg">Mentorship Program</CardTitle>
            <CardDescription className="text-white/70">
              Get guidance from experienced athletes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">50+ Mentors</div>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Find Mentor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-400" />
            <CardTitle>Success Stories</CardTitle>
          </div>
          <CardDescription className="text-white/80">
            Real athletes, real results - see how SAP helped students achieve their college sports dreams
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {successStories.map((story, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
                  {story.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{story.name}</h4>
                    <span className="text-sm text-white/60">• {story.sport}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <p className="text-sm font-semibold text-green-400">{story.achievement}</p>
                  </div>
                  <p className="text-sm text-white/80 italic">"{story.quote}"</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips and Resources */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-400" />
            <CardTitle>Recruiting Tips & Resources</CardTitle>
          </div>
          <CardDescription className="text-white/80">
            Expert advice and guides to maximize your recruitment success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">How to Write an Effective Email to Coaches</h4>
              <p className="text-sm text-white/70">Template and best practices for initial contact</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Creating the Perfect Highlight Video</h4>
              <p className="text-sm text-white/70">What coaches want to see in your film</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Understanding Athletic Scholarships</h4>
              <p className="text-sm text-white/70">Types of scholarships and how they work</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-1">Campus Visit Checklist</h4>
              <p className="text-sm text-white/70">What to ask and look for during visits</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
            View All Resources
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
