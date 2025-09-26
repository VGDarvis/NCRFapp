import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Users,
  Gamepad2
} from 'lucide-react';

const esportsSignUpSchema = z.object({
  // Basic Information
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  
  // College Information
  attendsCollege: z.boolean(),
  collegeName: z.string().optional(),
  planningCollege: z.enum(['yes', 'no', 'maybe']).optional(),
  
  // Esports Team Status
  onEsportsTeam: z.enum(['yes', 'no', 'no-team']),
  teamRole: z.enum(['captain', 'player', 'coach', 'manager']).optional(),
  interestedInTeam: z.enum(['yes', 'maybe', 'no']).optional(),
  
  // Game Preferences
  gamePreferences: z.array(z.string()).min(1, 'Please select at least one game'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EsportsSignUpFormData = z.infer<typeof esportsSignUpSchema>;

interface EsportsSignUpFormProps {
  onSuccess: () => void;
}

const gameOptions = [
  { id: 'nba2k26', name: 'NBA 2K26', icon: '🏀' },
  { id: 'madden26', name: 'Madden 26', icon: '🏈' },
  { id: 'smash', name: 'Super Smash Bros', icon: '🎮' },
  { id: 'tekken', name: 'Tekken', icon: '👊' },
  { id: 'sf6', name: 'Street Fighter 6', icon: '⚔️' }
];

const teamRoles = [
  { id: 'captain', name: 'Team Captain', icon: '👑' },
  { id: 'player', name: 'Player', icon: '🎯' },
  { id: 'coach', name: 'Coach', icon: '📋' },
  { id: 'manager', name: 'Manager', icon: '⚙️' }
];

export const EsportsSignUpForm = ({ onSuccess }: EsportsSignUpFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EsportsSignUpFormData>({
    resolver: zodResolver(esportsSignUpSchema),
    defaultValues: {
      attendsCollege: false,
      gamePreferences: [],
    },
  });

  const watchedValues = watch();
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    let fieldsToValidate: (keyof EsportsSignUpFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['email', 'password', 'confirmPassword', 'displayName'];
        break;
      case 2:
        fieldsToValidate = ['attendsCollege'];
        if (watchedValues.attendsCollege) {
          fieldsToValidate.push('collegeName');
        } else {
          fieldsToValidate.push('planningCollege');
        }
        break;
      case 3:
        fieldsToValidate = ['onEsportsTeam'];
        if (watchedValues.onEsportsTeam === 'yes') {
          fieldsToValidate.push('teamRole');
        } else if (watchedValues.onEsportsTeam === 'no') {
          fieldsToValidate.push('interestedInTeam');
        }
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGamePreference = (gameId: string) => {
    const current = watchedValues.gamePreferences || [];
    const updated = current.includes(gameId)
      ? current.filter(id => id !== gameId)
      : [...current, gameId];
    setValue('gamePreferences', updated);
    trigger('gamePreferences');
  };

  const onSubmit = async (data: EsportsSignUpFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            role: 'player',
            // Esports-specific metadata
            attends_college: data.attendsCollege,
            college_name: data.collegeName || null,
            planning_college: data.planningCollege || null,
            on_esports_team: data.onEsportsTeam,
            team_role: data.teamRole || null,
            interested_in_team: data.interestedInTeam || null,
            game_preferences: data.gamePreferences,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Welcome to NCRF Esports!",
        description: "Please check your email to verify your account.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Redirecting...",
        description: "You'll be redirected to Google to complete sign up.",
      });
    } catch (error: any) {
      toast({
        title: "Google sign up failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="glass-premium rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                i + 1 < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : i + 1 === currentStep
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-cyber rounded-xl p-6 space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 glass-premium rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Let's start with the essentials</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                  <Input
                    id="displayName"
                    {...register('displayName')}
                    className="glass-light border-primary/20 focus:border-primary/40"
                    placeholder="Your gaming name"
                  />
                  {errors.displayName && (
                    <p className="text-xs text-destructive mt-1">{errors.displayName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="glass-light border-primary/20 focus:border-primary/40"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register('password')}
                      className="glass-light border-primary/20 focus:border-primary/40 pr-10"
                      placeholder="Create a secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register('confirmPassword')}
                      className="glass-light border-primary/20 focus:border-primary/40 pr-10"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: College Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-cyber rounded-xl p-6 space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 glass-premium rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Education Background</h2>
                <p className="text-sm text-muted-foreground">Tell us about your academic journey</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Do you currently attend a college or HBCU?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue('attendsCollege', true)}
                      className={`glass-light p-3 rounded-lg border-2 transition-all duration-300 ${
                        watchedValues.attendsCollege
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('attendsCollege', false)}
                      className={`glass-light p-3 rounded-lg border-2 transition-all duration-300 ${
                        !watchedValues.attendsCollege
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {watchedValues.attendsCollege && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="collegeName" className="text-sm font-medium">Which college/HBCU do you attend?</Label>
                    <Input
                      id="collegeName"
                      {...register('collegeName')}
                      className="glass-light border-primary/20 focus:border-primary/40"
                      placeholder="Enter your college/HBCU name"
                    />
                    {errors.collegeName && (
                      <p className="text-xs text-destructive mt-1">{errors.collegeName.message}</p>
                    )}
                  </motion.div>
                )}

                {!watchedValues.attendsCollege && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium">Are you planning to attend college?</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'yes', label: 'Yes' },
                        { value: 'maybe', label: 'Maybe' },
                        { value: 'no', label: 'No' }
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setValue('planningCollege', option.value as 'yes' | 'no' | 'maybe')}
                          className={`glass-light p-2 rounded-lg border-2 transition-all duration-300 text-sm ${
                            watchedValues.planningCollege === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Esports Team Status */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-cyber rounded-xl p-6 space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 glass-premium rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Esports Team Experience</h2>
                <p className="text-sm text-muted-foreground">Your competitive gaming background</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Are you part of your school's esports team?</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'yes', label: 'Yes, I\'m on the team' },
                      { value: 'no', label: 'No, but we have a team' },
                      { value: 'no-team', label: 'We don\'t have an esports team' }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue('onEsportsTeam', option.value as 'yes' | 'no' | 'no-team')}
                        className={`w-full glass-light p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                          watchedValues.onEsportsTeam === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-primary/20 hover:border-primary/40'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {watchedValues.onEsportsTeam === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium">What's your role on the team?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {teamRoles.map(role => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setValue('teamRole', role.id as 'captain' | 'player' | 'coach' | 'manager')}
                          className={`glass-light p-3 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 ${
                            watchedValues.teamRole === role.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          <span>{role.icon}</span>
                          <span className="text-sm">{role.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {watchedValues.onEsportsTeam === 'no' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium">Would you like to join your school's esports team?</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'yes', label: 'Yes!' },
                        { value: 'maybe', label: 'Maybe' },
                        { value: 'no', label: 'No thanks' }
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setValue('interestedInTeam', option.value as 'yes' | 'maybe' | 'no')}
                          className={`glass-light p-2 rounded-lg border-2 transition-all duration-300 text-sm ${
                            watchedValues.interestedInTeam === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-primary/20 hover:border-primary/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Game Preferences */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-cyber rounded-xl p-6 space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 glass-premium rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Game Preferences</h2>
                <p className="text-sm text-muted-foreground">Which games do you compete in the most?</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {gameOptions.map(game => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => toggleGamePreference(game.id)}
                      className={`glass-light p-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-3 glass-glow ${
                        watchedValues.gamePreferences?.includes(game.id)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl">{game.icon}</span>
                      <span className="font-medium">{game.name}</span>
                      {watchedValues.gamePreferences?.includes(game.id) && (
                        <Check className="w-5 h-5 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.gamePreferences && (
                  <p className="text-xs text-destructive">{errors.gamePreferences.message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between glass-premium rounded-xl p-4">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          )}
        </div>

        {/* Google Sign Up (only on first step) */}
        {currentStep === 1 && (
          <div className="glass-light rounded-xl p-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full mt-4 glass-hover"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};