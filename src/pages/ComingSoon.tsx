import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Rocket, GraduationCap, Briefcase, Cpu, Activity, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

const upcomingPrograms = [
  {
    id: 'internships',
    name: 'Internships & Career',
    icon: Briefcase,
    description: 'Connect with career opportunities and professional development resources.',
  },
  {
    id: 'steam',
    name: 'STEaM',
    icon: Cpu,
    description: 'Explore science, technology, engineering, arts, and mathematics programs.',
  },
  {
    id: 'movement',
    name: 'Movement Enrichment',
    icon: Activity,
    description: 'Enhance wellness through physical activities and mindfulness programs.',
  },
  {
    id: 'athlete',
    name: 'Student Athlete',
    icon: Trophy,
    description: 'Support and resources for student athletes in academic and athletic pursuits.',
  },
];

const ComingSoon = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing!', {
        description: "We'll notify you when new programs launch.",
        duration: 4000,
      });
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <Rocket className="w-24 h-24 mx-auto text-primary" />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-display font-bold cyber-text-glow mb-4"
          >
            Coming Soon
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12"
          >
            We're working hard to bring you amazing new programs
          </motion.p>
          
          {/* Upcoming Programs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {upcomingPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 glass-premium hover:glass-glow transition-all duration-300 text-left">
                  <program.icon className="w-12 h-12 mb-3 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Email Notification Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-8 glass-cyber mb-8 max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Get Notified</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to know when we launch new programs!
              </p>
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Notify Me</Button>
              </form>
            </Card>
          </motion.div>
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/')}
              className="glass-premium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
