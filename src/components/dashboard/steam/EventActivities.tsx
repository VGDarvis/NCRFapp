import { Gamepad2, GraduationCap, Truck, Award, BookOpen } from 'lucide-react';

interface EventActivitiesProps {
  activities: string[];
}

const activityIcons: Record<string, any> = {
  'Esports Tournaments': Gamepad2,
  'Educational Seminars': BookOpen,
  'STEAM Mobile Lab': Truck,
  'Scholarship Information': GraduationCap,
  'Prize Pool & Rewards': Award,
};

const activityDescriptions: Record<string, string> = {
  'Esports Tournaments': 'Compete in Super Smash Bros and showcase your gaming skills',
  'Educational Seminars': 'Learn from industry experts and gain valuable insights',
  'STEAM Mobile Lab': 'Hands-on experiences with cutting-edge technology',
  'Scholarship Information': 'Discover scholarship opportunities and financial aid',
  'Prize Pool & Rewards': 'Win amazing prizes and exclusive rewards',
};

export const EventActivities = ({ activities }: EventActivitiesProps) => {
  return (
    <div className="glass-premium p-6 rounded-2xl border border-purple-500/20">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        What's Happening
      </h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity] || Gamepad2;
          const description = activityDescriptions[activity] || activity;
          
          return (
            <div 
              key={index}
              className="p-4 glass-light rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-all">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{activity}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
