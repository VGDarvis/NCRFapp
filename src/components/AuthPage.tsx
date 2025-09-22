import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/LoginForm';
import { SignUpForm } from '@/components/SignUpForm';
import { GraduationCap, Users, Shield } from 'lucide-react';

type AuthMode = 'login' | 'signup';
type UserRole = 'player' | 'coach' | 'admin';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [selectedRole, setSelectedRole] = useState<UserRole>('player');

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && ['player', 'coach', 'admin'].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const roles = [
    {
      id: 'player' as UserRole,
      title: 'Student Player',
      icon: GraduationCap,
      description: 'Compete for your HBCU',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'coach' as UserRole,
      title: 'Coach/Manager',
      icon: Users,
      description: 'Lead and mentor teams',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      icon: Shield,
      description: 'Manage the platform',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Welcome to <span className="text-primary">HBCU Esports</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your role and {authMode === 'login' ? 'sign in' : 'join the league'}
          </p>
        </div>

        <div className="luxury-card p-8 animate-scale-in">
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/20">
              {roles.map((role) => (
                <TabsTrigger 
                  key={role.id} 
                  value={role.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <role.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{role.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {roles.map((role) => (
              <TabsContent key={role.id} value={role.id} className="mt-0">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <role.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{role.title}</h2>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </h3>
                    {authMode === 'signup' ? (
                      <SignUpForm role={role.id} onSuccess={() => navigate('/dashboard')} />
                    ) : (
                      <LoginForm onSuccess={() => navigate('/dashboard')} />
                    )}
                  </div>

                  <div className="hidden lg:block">
                    <div className="luxury-card p-6 h-full bg-gradient-to-br from-primary/5 to-transparent">
                      <h4 className="font-semibold text-lg mb-4">As a {role.title}:</h4>
                      <ul className="space-y-3">
                        {role.id === 'player' && (
                          <>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Join your HBCU's esports team
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Compete in national tournaments
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Earn XP and convert to USD
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Access mentorship programs
                            </li>
                          </>
                        )}
                        {role.id === 'coach' && (
                          <>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Manage team rosters and strategies
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Organize practice sessions
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Mentor student athletes
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Access coaching resources
                            </li>
                          </>
                        )}
                        {role.id === 'admin' && (
                          <>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Manage tournaments and events
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Oversee platform operations
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Access analytics and reports
                            </li>
                            <li className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              Manage user accounts
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-primary hover:underline transition-colors"
                  >
                    {authMode === 'login' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};