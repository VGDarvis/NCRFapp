import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Video, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface LearningTabProps {
  user: User | null;
  isGuest?: boolean;
}

const courses = [
  {
    id: 1,
    title: 'Introduction to Robotics',
    category: 'Engineering',
    level: 'Beginner',
    progress: 60,
    modules: 12,
    completed: 7,
    duration: '6 weeks',
    enrolled: 1234,
    rating: 4.8,
    thumbnail: '🤖',
    description: 'Learn the fundamentals of robotics and build your first robot'
  },
  {
    id: 2,
    title: 'Digital Art Fundamentals',
    category: 'Arts',
    level: 'Beginner',
    progress: 25,
    modules: 10,
    completed: 3,
    duration: '4 weeks',
    enrolled: 892,
    rating: 4.9,
    thumbnail: '🎨',
    description: 'Master digital art tools and creative design principles'
  },
  {
    id: 3,
    title: 'Python Programming',
    category: 'Technology',
    level: 'Intermediate',
    progress: 0,
    modules: 15,
    completed: 0,
    duration: '8 weeks',
    enrolled: 2145,
    rating: 4.7,
    thumbnail: '💻',
    description: 'Write powerful programs and automate tasks with Python'
  },
  {
    id: 4,
    title: 'Applied Mathematics',
    category: 'Mathematics',
    level: 'Advanced',
    progress: 0,
    modules: 20,
    completed: 0,
    duration: '10 weeks',
    enrolled: 567,
    rating: 4.6,
    thumbnail: '📐',
    description: 'Solve complex real-world problems using advanced math'
  }
];

const resources = [
  { type: 'video', title: 'How Circuits Work', duration: '12:34', icon: Video },
  { type: 'article', title: 'The Art of Algorithm Design', duration: '8 min read', icon: FileText },
  { type: 'tutorial', title: '3D Modeling Basics', duration: '25:17', icon: BookOpen },
  { type: 'video', title: 'Chemistry Lab Safety', duration: '9:45', icon: Video },
];

export const LearningTab = ({ user, isGuest }: LearningTabProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Learning <span className="text-purple-400">Hub</span>
        </h1>
        <p className="text-muted-foreground">
          Structured courses and resources to master STEAM subjects
        </p>
      </div>

      {/* My Courses */}
      {!isGuest && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Continue Learning
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.filter(c => c.progress > 0).map((course) => (
              <div
                key={course.id}
                className="glass-premium p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{course.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {course.completed} of {course.modules} modules
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  Continue Course
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {isGuest ? 'Featured Courses' : 'Explore More Courses'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.filter(c => c.progress === 0).map((course) => (
            <div
              key={course.id}
              className="glass-light p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
            >
              <div className="text-3xl mb-3 text-center group-hover:scale-110 transition-transform">
                {course.thumbnail}
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ⭐ {course.rating}
                </span>
              </div>
              <button className="w-full px-3 py-2 bg-purple-500/10 text-purple-300 rounded-lg text-sm font-semibold hover:bg-purple-500/20 transition-all">
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Resources */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Quick Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <div
                key={idx}
                className="glass-light p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer flex items-center gap-4"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {resource.duration}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-muted-foreground hover:text-purple-400 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
