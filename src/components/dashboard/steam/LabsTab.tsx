import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Microscope, Beaker, Zap, Atom, TestTube, Lightbulb } from 'lucide-react';

interface LabsTabProps {
  user: User | null;
  isGuest?: boolean;
}

const virtualLabs = [
  {
    id: 1,
    title: 'Virtual Chemistry Lab',
    description: 'Mix chemicals and observe reactions in a safe virtual environment',
    icon: Beaker,
    gradient: 'from-cyan-500 to-blue-400',
    experiments: 15,
    difficulty: 'Beginner',
    category: 'Chemistry'
  },
  {
    id: 2,
    title: 'Physics Simulation Lab',
    description: 'Experiment with forces, motion, and energy principles',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-400',
    experiments: 12,
    difficulty: 'Intermediate',
    category: 'Physics'
  },
  {
    id: 3,
    title: 'Biology Virtual Lab',
    description: 'Explore cells, DNA, and biological systems',
    icon: Microscope,
    gradient: 'from-green-500 to-emerald-400',
    experiments: 10,
    difficulty: 'Beginner',
    category: 'Biology'
  },
  {
    id: 4,
    title: 'Atomic Structure Lab',
    description: 'Study atoms, molecules, and chemical bonds',
    icon: Atom,
    gradient: 'from-purple-500 to-violet-400',
    experiments: 8,
    difficulty: 'Advanced',
    category: 'Chemistry'
  }
];

const experiments = [
  {
    title: 'Acid-Base Reactions',
    duration: '15 min',
    safety: 'Safe',
    materials: ['Virtual Beakers', 'pH Indicators', 'Acids & Bases']
  },
  {
    title: 'Projectile Motion',
    duration: '20 min',
    safety: 'Safe',
    materials: ['Virtual Launcher', 'Angle Meter', 'Target Grid']
  },
  {
    title: 'Cell Division',
    duration: '25 min',
    safety: 'Safe',
    materials: ['Virtual Microscope', 'Cell Samples', 'Staining Tools']
  },
  {
    title: 'Electrical Circuits',
    duration: '30 min',
    safety: 'Safe',
    materials: ['Virtual Wires', 'Batteries', 'Resistors', 'Multimeter']
  }
];

export const LabsTab = ({ user, isGuest }: LabsTabProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Virtual <span className="text-purple-400">Labs</span>
        </h1>
        <p className="text-muted-foreground">
          Conduct safe experiments and explore scientific concepts
        </p>
      </div>

      {/* Virtual Labs Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Microscope className="w-6 h-6 text-purple-400" />
          Interactive Lab Simulations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {virtualLabs.map((lab) => {
            const Icon = lab.icon;
            return (
              <div
                key={lab.id}
                className="glass-premium p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-4 bg-gradient-to-br ${lab.gradient} rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-purple-400 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lab.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {lab.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          lab.difficulty === 'Beginner' 
                            ? 'border-green-500/30 text-green-400'
                            : lab.difficulty === 'Intermediate'
                            ? 'border-yellow-500/30 text-yellow-400'
                            : 'border-red-500/30 text-red-400'
                        }`}
                      >
                        {lab.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lab.experiments} Experiments
                      </Badge>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  Enter Lab
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Experiments */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TestTube className="w-6 h-6 text-purple-400" />
          Featured Experiments
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {experiments.map((experiment, idx) => (
            <div
              key={idx}
              className="glass-light p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                  {experiment.safety}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground mb-2">
                {experiment.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Duration: {experiment.duration}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Materials:
                </p>
                {experiment.materials.map((material, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                    {material}
                  </p>
                ))}
              </div>
              <button className="w-full mt-4 px-3 py-2 bg-purple-500/10 text-purple-300 rounded-lg text-sm font-semibold hover:bg-purple-500/20 transition-all">
                Start Experiment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="glass-premium p-6 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <Beaker className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Safe Learning Environment
            </h3>
            <p className="text-sm text-muted-foreground">
              All virtual labs are completely safe and simulate real scientific experiments. 
              You can explore, make mistakes, and learn without any risk. Always remember to 
              follow safety guidelines when conducting real laboratory experiments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
