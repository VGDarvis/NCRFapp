import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegistrations } from "@/hooks/useRegistrations";
import { RegistrationSuccess } from "./RegistrationSuccess";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const registrationSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(50),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  grade_level: z.string().optional(),
  graduation_year: z.number().optional(),
  school_name: z.string().optional(),
  role: z.enum(["student", "parent", "counselor", "other"]).default("student"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationDrawerProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  event?: any;
  onViewSchedule?: () => void;
}

export const RegistrationDrawer = ({
  open,
  onClose,
  eventId,
  eventTitle,
  event,
  onViewSchedule,
}: RegistrationDrawerProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const { createRegistration } = useRegistrations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: "student",
    },
  });

  useEffect(() => {
    if (open) {
      // Pre-fill email if user is authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setValue("email", user.email);
        }
      });
    } else {
      // Reset form when drawer closes
      setShowSuccess(false);
      setRegistrationResult(null);
      reset();
    }
  }, [open, setValue, reset]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const result = await createRegistration.mutateAsync({
        event_id: eventId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        grade_level: data.grade_level,
        graduation_year: data.graduation_year,
        school_name: data.school_name,
        role: data.role,
      });
      setRegistrationResult(result);
      setShowSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleViewSchedule = () => {
    onClose();
    if (onViewSchedule) {
      onViewSchedule();
    }
  };

  if (showSuccess && registrationResult) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="overflow-y-auto">
          <RegistrationSuccess
            registration={registrationResult}
            event={event || { title: eventTitle, start_at: new Date().toISOString() }}
            onViewSchedule={handleViewSchedule}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Register for {eventTitle}</SheetTitle>
          <SheetDescription>
            Fill out the form below to register for this event.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                placeholder="John"
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select onValueChange={(value) => setValue("role", value as any)} defaultValue="student">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="counselor">Counselor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade_level">Grade Level (Optional)</Label>
            <Select onValueChange={(value) => setValue("grade_level", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="11th">11th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="College Freshman">College Freshman</SelectItem>
                <SelectItem value="College Sophomore">College Sophomore</SelectItem>
                <SelectItem value="College Junior">College Junior</SelectItem>
                <SelectItem value="College Senior">College Senior</SelectItem>
                <SelectItem value="Graduate">Graduate Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_name">School Name (Optional)</Label>
            <Input
              id="school_name"
              {...register("school_name")}
              placeholder="Your high school or college"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={createRegistration.isPending}
            >
              {createRegistration.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
