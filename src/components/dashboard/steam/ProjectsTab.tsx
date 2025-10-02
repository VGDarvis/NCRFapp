import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Cpu, Palette, Calculator, Lightbulb, Star } from 'lucide-react';

interface ProjectsTabProps {
  user: User | null;
  isGuest?: boolean;
}

const projects = [
  {
    id: 1,
    title: 'Build a Solar-Powered Car',
    category: 'Engineering',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
    icon: FlaskConical,
    gradient: 'from-amber-500 to-orange-400',
    description: 'Design and build a miniature car powered by solar energy',
    skills: ['Physics', 'Engineering', 'Problem Solving']
  },
  {
    id: 2,
    title: 'Create Your First Website',
    category: 'Technology',
    difficulty: 'Beginner',
    duration: '1-2 hours',
    icon: Cpu,
    gradient: 'from-blue-500 to-cyan-400',
    description: 'Learn HTML, CSS, and build your personal website',
    skills: ['Web Development', 'Design', 'Coding']
  },
  {
    id: 3,
    title: 'Digital Art Portfolio',
    category: 'Arts',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-400',
    description: 'Create stunning digital artwork using design principles',
    skills: ['Design', 'Creativity', 'Digital Tools']
  },
  {
    id: 4,
    title: 'Math in Real World',
    category: 'Mathematics',
    difficulty: 'Advanced',
    duration: '2 hours',
    icon: Calculator,
    gradient: 'from-green-500 to-emerald-400',
    description: 'Solve real-world problems using advanced mathematics',
    skills: ['Algebra', 'Statistics', 'Analysis']
  },
  {
    id: 5,
    title: 'Arduino LED Controller',
    category: 'Technology',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
    icon: Lightbulb,
    gradient: 'from-purple-500 to-violet-400',
    description: 'Program an Arduino to create custom LED light patterns',
    skills: ['Programming', 'Electronics', 'Logic']
  },
  {
    id: 6,
    title: 'Chemistry Experiments',
    category: 'Science',
    difficulty: 'Beginner',
    duration: '1 hour',
    icon: FlaskConical,
    gradient: 'from-teal-500 to-cyan-400',
    description: 'Safe and fun chemistry experiments you can do at home',
    skills: ['Chemistry', 'Observation', 'Safety']
  }
];

export const ProjectsTab = ({ user, isGuest }: ProjectsTabProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Interactive <span className="text-purple-400">Projects</span>
        </h1>
        <p className="text-muted-foreground">
          Hands-on learning through creative STEAM projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <div
              key={project.id}
              className="glass-premium p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
            >
              {/* Project Icon */}
              <div className={`inline-flex p-3 bg-gradient-to-br ${project.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Project Info */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-400 cursor-pointer transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
              </div>

              {/* Project Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      project.difficulty === 'Beginner' 
                        ? 'border-green-500/30 text-green-400'
                        : project.difficulty === 'Intermediate'
                        ? 'border-yellow-500/30 text-yellow-400'
                        : 'border-red-500/30 text-red-400'
                    }`}
                  >
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.duration}
                  </Badge>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {project.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Start Project
              </button>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      {isGuest && (
        <div className="mt-8 p-6 glass-premium rounded-xl border border-purple-500/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ready to start building?
          </h3>
          <p className="text-muted-foreground mb-4">
            Sign up to save your progress and unlock more projects
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};
