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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
  status: z.enum(["Pending", "Approved"]),
  rating: z.number().min(1).max(5),
  avatar: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function TestimonialForm({
  initialData,
  isEditMode = false,
}: {
  initialData?: any;
  isEditMode?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          text: initialData.text.replace(/"/g, ""),
          status: initialData.status,
          rating: initialData.rating,
        }
      : {
          name: "",
          text: "",
          status: "Pending",
          rating: 5,
        },
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("patient_name", values.name);
      formData.append("message", values.text);
      formData.append("status", values.status);
      formData.append("rating", values.rating.toString());

      if (values.avatar?.length) {
        formData.append("photo", values.avatar[0]);
      }

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const endpoint = isEditMode
        ? `${API}/testimonials/${initialData.id}`
        : `${API}/testimonials/add`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      router.push("/testimonials");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-headline text-xl font-bold">
            {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? "Update testimonial details." : "Create a new testimonial."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Text */}
                <div className="col-span-1 space-y-8 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Content</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[200px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Side column */}
                <div className="col-span-1 space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "h-6 w-6 cursor-pointer",
                                  field.value >= s
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                )}
                                onClick={() => field.onChange(s)}
                              />
                            ))}
                          </div>
                        </FormControl>
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
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormDescription>Optional.</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.push("/testimonials")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Testimonial"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
