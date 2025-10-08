import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useYouthServices } from "@/hooks/useYouthServices";

const youthServiceSchema = z.object({
  organization_name: z.string().min(1, "Organization name is required"),
  service_type: z.string().min(1, "Service type is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip_code: z.string().optional(),
  min_age: z.coerce.number().min(0).max(30).optional(),
  max_age: z.coerce.number().min(0).max(30).optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  data_source: z.enum(["partner", "api", "manual"]),
  is_verified: z.boolean().default(false),
});

type YouthServiceFormData = z.infer<typeof youthServiceSchema>;

interface YouthServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any;
}

export function YouthServiceDialog({ open, onOpenChange, service }: YouthServiceDialogProps) {
  const { createYouthService, updateYouthService } = useYouthServices();
  const isEditing = !!service;

  const form = useForm<YouthServiceFormData>({
    resolver: zodResolver(youthServiceSchema),
    defaultValues: {
      organization_name: "",
      service_type: "",
      city: "",
      state: "",
      data_source: "manual",
      is_verified: false,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        organization_name: service.organization_name || "",
        service_type: service.service_type || "",
        address: service.address || "",
        city: service.city || "",
        state: service.state || "",
        zip_code: service.zip_code || "",
        min_age: service.min_age || undefined,
        max_age: service.max_age || undefined,
        contact_phone: service.contact_phone || "",
        contact_email: service.contact_email || "",
        website: service.website || "",
        description: service.description || "",
        data_source: service.data_source || "manual",
        is_verified: service.is_verified || false,
      });
    } else {
      form.reset({
        organization_name: "",
        service_type: "",
        city: "",
        state: "",
        data_source: "manual",
        is_verified: false,
      });
    }
  }, [service, form]);

  const onSubmit = async (data: YouthServiceFormData) => {
    if (isEditing) {
      await updateYouthService.mutateAsync({ id: service.id, updates: data });
    } else {
      await createYouthService.mutateAsync(data);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Youth Service" : "Add Youth Service"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="organization_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter organization name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Youth Sports, Tutoring, Mentorship" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="CA" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="18" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(555) 123-4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="contact@example.org" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.org" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Organization description" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="partner">Partner Data</SelectItem>
                      <SelectItem value="api">API Import</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="action-button">
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
