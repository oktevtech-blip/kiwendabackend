'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react"; // ✅ import all icons
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ✅ Validation Schema
const serviceSchema = z.object({
  name: z.string().min(1, { message: "Service name is required." }),
  description: z.string().min(1, { message: "Short description is required." }),
  long_description: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  status: z.enum(["Active", "Inactive"]),
  icon: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: ServiceFormValues;
  isEditMode?: boolean;
}

export function ServiceForm({ initialData, isEditMode = false }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      long_description: "",
      category: "",
      status: "Inactive",
      icon: "",
    },
  });

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData, form]);

  // ✅ Submit handler
  async function onSubmit(values: ServiceFormValues) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("long_description", values.long_description || "");
      formData.append("category", values.category);
      formData.append("status", values.status.toLowerCase());
      formData.append("icon", values.icon || "");

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const response = await fetch("http://localhost:5000/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${text}`);
      }

      toast.success("✅ Service added successfully!");
      router.push("/services");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to save service.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Only hospital/healthcare-related icons
  const hospitalIconNames = [
    "BrainCircuit",
    "Droplets",
    "Bone",
    "Baby",
    "HeartHandshake",
    "Heart",
    "Heartbeat",
    "HeartPulse",
    "Hospital",
    "Stethoscope",
    "Ambulance",
    "Bandage",
    "Syringe",
    "Thermometer",
    "Pill",
    "FirstAidKit",
    "Activity",
    "Cross",
    "UserRound",
    "User",
    "Users",
    "ShieldPlus",
    "LifeBuoy",
    "SmilePlus",
    "TestTube",
    "ClipboardList",
    "FileText",
    "HospitalIcon", // fallback custom name (not in Lucide)
  ];

  const hospitalIcons = Object.entries(LucideIcons).filter(([name]) =>
    hospitalIconNames.includes(name)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="font-headline text-xl font-bold tracking-tight">
            {isEditMode ? "Edit Service" : "Add a New Service"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update the details for this service."
              : "Fill out the details for the new service you want to offer."}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Left Section */}
                <div className="col-span-1 space-y-8 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Physiotherapy" {...field} />
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
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief summary of the service."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown on service listing pages.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="long_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A detailed description of the service, what it involves, and who it's for."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown on the service detail page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Section */}
                <div className="col-span-1 space-y-8">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Physical Rehab" {...field} />
                        </FormControl>
                        <FormDescription>
                          Helps group similar services together.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ✅ Icon Dropdown */}
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a hospital-related icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-64 overflow-y-auto">
                            {hospitalIcons.map(([name, Icon]) => {
                              const LucideIcon = Icon as React.ComponentType<{
                                className?: string;
                              }>;
                              return (
                                <SelectItem key={name} value={name}>
                                  <div className="flex items-center gap-2">
                                    <LucideIcon className="h-4 w-4" />
                                    <span>{name}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a hospital or health-related icon.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <FormLabel>Service Image</FormLabel>
                    <Input type="file" ref={fileInputRef} />
                    <FormDescription>
                      Upload an image that represents this service.
                    </FormDescription>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/services")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Service"
                    : "Save Service"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ Default Export
export default function NewServicePage() {
  return <ServiceForm />;
}
