import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Dumbbell, Target, Heart, Award } from "lucide-react";

const sports = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    icon: Trophy,
    description: "Track your basketball stats, connect with college coaches, and showcase your skills",
    color: "bg-orange-500"
  },
  {
    id: "football",
    name: "Football",
    icon: Target,
    description: "Position-specific training, game film analysis, and recruiting timeline management",
    color: "bg-green-600"
  },
  {
    id: "womens-basketball",
    name: "Women's Basketball",
    icon: Trophy,
    description: "Showcase your talent, track performance metrics, and connect with recruiters",
    color: "bg-purple-500"
  },
  {
    id: "softball",
    name: "Softball",
    icon: Award,
    description: "Batting and pitching stats, tournament results, and college showcase opportunities",
    color: "bg-yellow-500"
  },
  {
    id: "track-field",
    name: "Track & Field",
    icon: Dumbbell,
    description: "Event specializations, personal records, meet results, and recruiting connections",
    color: "bg-blue-500"
  },
  {
    id: "collegiate",
    name: "Collegiate Programs",
    icon: Users,
    description: "Advanced recruitment tools and resources for serious college prospects",
    color: "bg-indigo-600"
  },
  {
    id: "the-411",
    name: "The 411",
    icon: Heart,
    description: "Essential recruiting information, tips, eligibility guidance, and academic requirements",
    color: "bg-pink-500"
  }
];

export default function SportsTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Sports Programs</CardTitle>
          <CardDescription className="text-white/80">
            Select your sport to access specialized recruitment tools and resources
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map((sport) => (
          <Card key={sport.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
            <CardHeader>
              <div className={`w-12 h-12 rounded-full ${sport.color} flex items-center justify-center mb-3`}>
                <sport.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{sport.name}</CardTitle>
              <CardDescription className="text-white/70">
                {sport.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Section */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle>Multi-Sport Athletes</CardTitle>
          <CardDescription className="text-white/80">
            Participate in multiple sports? You can create profiles for each sport you play
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 mb-4">
            Many college recruiters value multi-sport athletes for their versatility, work ethic, and diverse skill sets.
            Build separate profiles to showcase your abilities in each sport.
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            Add Another Sport
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
