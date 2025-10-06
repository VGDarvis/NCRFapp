import { GraduationCap, Users, FileText, TrendingUp } from 'lucide-react';

interface EventActivitiesProps {
  activities: string[];
}

const activityIcons: Record<string, any> = {
  'Virtual Workshops': GraduationCap,
  'NCAA Eligibility Guidance': FileText,
  'Recruiting Resources': TrendingUp,
  'College Planning Support': Users,
};

const activityDescriptions: Record<string, string> = {
  'Virtual Workshops': 'Interactive 4-part seminar series with expert guidance',
  'NCAA Eligibility Guidance': 'Learn about eligibility requirements and academic standards',
  'Recruiting Resources': 'Access tools and strategies for your recruiting journey',
  'College Planning Support': 'Get personalized support for your college planning',
};

export const EventActivities = ({ activities }: EventActivitiesProps) => {
  return (
    <div className="glass-premium p-6 rounded-2xl border border-amber-500/20">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        What's Included
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity] || GraduationCap;
          const description = activityDescriptions[activity] || activity;
          
          return (
            <div 
              key={index}
              className="p-4 glass-light rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                  <Icon className="w-5 h-5 text-amber-400" />
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
