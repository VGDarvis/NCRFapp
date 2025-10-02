import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Award, Sparkles, Heart, Eye } from 'lucide-react';

interface CommunityTabProps {
  user: User | null;
  isGuest?: boolean;
}

const showcaseProjects = [
  {
    id: 1,
    title: 'Solar Panel Efficiency Tracker',
    author: 'Sarah Chen',
    category: 'Engineering',
    thumbnail: '☀️',
    description: 'Built an IoT device to monitor solar panel efficiency in real-time',
    likes: 234,
    views: 1432,
    comments: 45
  },
  {
    id: 2,
    title: 'AI Art Generator',
    author: 'Marcus Johnson',
    category: 'Technology',
    thumbnail: '🎨',
    description: 'Created a neural network that generates unique digital artwork',
    likes: 187,
    views: 923,
    comments: 32
  },
  {
    id: 3,
    title: 'Climate Change Visualization',
    author: 'Emily Rodriguez',
    category: 'Science',
    thumbnail: '🌍',
    description: 'Interactive data visualization showing climate trends over 50 years',
    likes: 312,
    views: 2104,
    comments: 67
  }
];

const discussions = [
  {
    title: 'Best practices for Arduino projects?',
    author: 'Alex Thompson',
    category: 'Engineering',
    replies: 23,
    time: '2 hours ago'
  },
  {
    title: 'How to improve my digital art skills',
    author: 'Jordan Lee',
    category: 'Arts',
    replies: 15,
    time: '5 hours ago'
  },
  {
    title: 'Need help with Python data structures',
    author: 'Chris Martinez',
    category: 'Technology',
    replies: 31,
    time: '1 day ago'
  }
];

const mentors = [
  {
    name: 'Dr. Patricia Williams',
    role: 'Robotics Engineer',
    specialties: ['Robotics', 'Mechanical Engineering', 'AI'],
    students: 45,
    rating: 4.9
  },
  {
    name: 'Prof. James Anderson',
    role: 'Computer Scientist',
    specialties: ['Programming', 'Algorithms', 'Web Dev'],
    students: 67,
    rating: 4.8
  },
  {
    name: 'Ms. Lisa Chen',
    role: 'Digital Artist',
    specialties: ['Digital Art', 'Design', '3D Modeling'],
    students: 38,
    rating: 5.0
  }
];

export const CommunityTab = ({ user, isGuest }: CommunityTabProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Community <span className="text-purple-400">Hub</span>
        </h1>
        <p className="text-muted-foreground">
          Connect, share, and learn from fellow STEAM enthusiasts
        </p>
      </div>

      {/* Student Showcase */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          Student Showcase
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {showcaseProjects.map((project) => (
            <div
              key={project.id}
              className="glass-premium p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
            >
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                {project.thumbnail}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                by {project.author}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{project.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{project.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Forum */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          Recent Discussions
        </h2>
        <div className="space-y-3">
          {discussions.map((discussion, idx) => (
            <div
              key={idx}
              className="glass-light p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {discussion.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>by {discussion.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {discussion.category}
                  </Badge>
                  <span>{discussion.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.replies}</span>
              </div>
            </div>
          ))}
        </div>
        {!isGuest && (
          <button className="w-full mt-4 px-4 py-3 glass-light border border-purple-500/20 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/10 transition-all">
            Start a Discussion
          </button>
        )}
      </div>

      {/* Mentorship */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-400" />
          Meet Our Mentors
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {mentors.map((mentor, idx) => (
            <div
              key={idx}
              className="glass-premium p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center text-white text-2xl font-bold">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mentor.role}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-1">
                  {mentor.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {mentor.students} students
                  </span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-foreground font-semibold">
                      {mentor.rating}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guest CTA */}
      {isGuest && (
        <div className="glass-premium p-6 rounded-xl border border-purple-500/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Join the STEAM Community
          </h3>
          <p className="text-muted-foreground mb-4">
            Sign up to share projects, join discussions, and connect with mentors
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};
