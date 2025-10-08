import { Shield, LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../shared/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminHeaderProps {
  userEmail?: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.rpc('log_admin_action', {
      p_action: 'admin_logout',
    });
    
    await supabase.auth.signOut();
    
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal.",
    });
    
    navigate('/');
  };

  return (
    <header className="glass-premium border-b border-primary/20 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">NCRF Admin</h1>
              <p className="text-xs text-muted-foreground">HR & Outreach Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userEmail && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-medium border border-primary/20">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{userEmail}</span>
              </div>
            )}
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            
            <ThemeToggle />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className="glass-medium border-primary/20 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
