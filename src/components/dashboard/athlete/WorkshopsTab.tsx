import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, CheckCircle2, AlertCircle } from "lucide-react";

const workshops = [
  {
    id: 1,
    title: "Beginning Your Recruiting Journey",
    date: "November 3rd",
    time: "6:00 PM EST",
    description: "Learn the fundamentals of college sports recruitment and how to get started on the right foot.",
    status: "upcoming",
    registered: false
  },
  {
    id: 2,
    title: "Are You a 5 Star Athlete?",
    date: "December 8th",
    time: "6:00 PM EST",
    description: "Understand what college coaches look for and how to showcase your athletic abilities effectively.",
    status: "upcoming",
    registered: false
  },
  {
    id: 3,
    title: "Are You Prepared: Eligibility & Academics",
    date: "January 5th",
    time: "6:00 PM EST",
    description: "Master NCAA eligibility requirements, academic standards, and maintaining your student-athlete status.",
    status: "upcoming",
    registered: false
  },
  {
    id: 4,
    title: "Sealing the Deal: Advocate for Yourself",
    date: "February 9th",
    time: "6:00 PM EST",
    description: "Learn negotiation strategies, how to evaluate offers, and make the best decision for your future.",
    status: "upcoming",
    registered: false
  }
];

export default function WorkshopsTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Virtual Recruiting Workshop Series</CardTitle>
          <CardDescription className="text-white/80">
            4-Part SAP seminar series designed to guide you through the college recruitment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-white/90">
            <Video className="h-5 w-5" />
            <span>All workshops are virtual and free for SAP members</span>
          </div>
        </CardContent>
      </Card>

      {/* Workshop List */}
      <div className="space-y-4">
        {workshops.map((workshop, index) => (
          <Card key={workshop.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-amber-500 text-white">Session {index + 1}</Badge>
                    {workshop.registered ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Registered
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/20 text-white">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Not Registered
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{workshop.title}</CardTitle>
                  <CardDescription className="text-white/70 mt-2">
                    {workshop.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span>{workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Video className="h-4 w-4" />
                    <span>Virtual Event</span>
                  </div>
                </div>
                <Button 
                  className={workshop.registered 
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" 
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                  }
                >
                  {workshop.registered ? "View Details" : "Register Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Library */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle>Workshop Resource Library</CardTitle>
          <CardDescription className="text-white/80">
            Access recordings, materials, and guides from past workshops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 mb-4">
            Complete the workshop series to unlock exclusive recruiting guides, templates, and video resources.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Recruiting Checklist
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Email Templates
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              NCAA Guide
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Past Recordings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
