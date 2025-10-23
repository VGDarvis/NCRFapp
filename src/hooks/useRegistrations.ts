import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RegistrationFormData {
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  grade_level?: string;
  graduation_year?: number;
  school_name?: string;
  role?: string;
}

export const useRegistrations = () => {
  const queryClient = useQueryClient();

  // Fetch user's registrations
  const { data: myRegistrations, isLoading: isLoadingMy } = useQuery({
    queryKey: ['registrations', 'my'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          events (
            id,
            title,
            start_at,
            end_at,
            event_type,
            image_url,
            venues:venue_id (
              name,
              address,
              city,
              state,
              zip_code
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create registration mutation
  const createRegistration = useMutation({
    mutationFn: async (registrationData: RegistrationFormData) => {
      // Generate unique QR code
      const qrCode = crypto.randomUUID();
      
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert registration
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          ...registrationData,
          user_id: user?.id || null,
          qr_code: qrCode,
          status: 'confirmed',
          registered_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Call edge function to generate QR image and send email
      try {
        const { error: edgeError } = await supabase.functions.invoke('send-registration-confirmation', {
          body: { registration_id: data.id }
        });
        
        if (edgeError) {
          console.error('Failed to send confirmation:', edgeError);
          toast.warning('Registration confirmed, but email failed to send. Check spam folder or contact support.');
        }
      } catch (err) {
        console.error('Edge function error:', err);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success('Registration successful! Check your email for confirmation.');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  });

  return {
    myRegistrations,
    isLoadingMy,
    createRegistration
  };
};
