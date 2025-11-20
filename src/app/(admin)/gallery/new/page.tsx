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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ✅ Validation schema
const imageSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  alt: z.string().min(1, { message: "Alt text is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  image: z.any(),
});

type ImageFormValues = z.infer<typeof imageSchema>;

export default function NewImagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: "",
      alt: "",
      category: "",
    },
  });

  // ✅ Handle form submission
  async function onSubmit(values: ImageFormValues) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("category", values.category);
  formData.append("uploaded_by", "1"); // You can replace with logged-in admin ID
  if (values.image && values.image[0]) {
    formData.append("image", values.image[0]);
  }

  try {
    const res = await fetch("http://localhost:5000/gallery/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Upload failed:", text);
      alert("Image upload failed!");
      return;
    }

    const data = await res.json();
    console.log("Upload successful:", data);
    alert("Image uploaded successfully!");
    router.push("/gallery");
  } catch (err) {
    console.error("Upload error:", err);
  }
}


  return (
    <div className="space-y-6">
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
            Upload a New Image
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill out the details for the new image.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="col-span-1 space-y-8 md:col-span-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => field.onChange(e.target.files)}
                            />
                          </FormControl>
                          <FormDescription>
                            Select an image file to upload.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-1 space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Physical Therapy Session"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A title for the image to be displayed in the gallery.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., A smiling patient"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short, descriptive text for screen readers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Facility" {...field} />
                        </FormControl>
                        <FormDescription>
                          Helps group similar images together.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/gallery")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
