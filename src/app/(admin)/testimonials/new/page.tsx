// 'use client';

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ArrowLeft, Star } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { cn } from "@/lib/utils";

// // ✅ Validation schema
// const testimonialSchema = z.object({
//   name: z.string().min(1, { message: "Patient name is required." }),
//   text: z.string().min(1, { message: "Testimonial text is required." }),
//   status: z.enum(["Pending", "Approved"]),
//   rating: z.number().min(1).max(5),
//   avatar: z.any().optional(),
// });

// type TestimonialFormValues = z.infer<typeof testimonialSchema>;

// export default function NewTestimonialPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<TestimonialFormValues>({
//     resolver: zodResolver(testimonialSchema),
//     defaultValues: {
//       name: "",
//       text: "",
//       status: "Pending",
//       rating: 5,
//     },
//   });

//   // ✅ Submit handler
//   async function onSubmit(values: TestimonialFormValues) {
//     try {
//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append("patient_name", values.name);
//       formData.append("message", values.text);
//       formData.append("status", values.status);
//       formData.append("rating", values.rating.toString());

//       if (values.avatar && values.avatar.length > 0) {
//         formData.append("photo", values.avatar[0]);
//       }

//       // ✅ Change this to your backend URL
//       // Example: NEXT_PUBLIC_API_URL=http://localhost:5000/api
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//       const response = await fetch(`${apiUrl}/testimonials/add`, {
//         method: "POST",
//         body: formData,
//       });

//       // ⚠️ Ensure valid JSON response
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error("Server did not return valid JSON. Check your backend route.");
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to save testimonial");
//       }

//       console.log("✅ Testimonial saved:", data);
//       router.push("/testimonials");
//     } catch (error: any) {
//       console.error("❌ Error adding testimonial:", error.message);
//       alert(`Failed to add testimonial: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
//           <ArrowLeft className="h-4 w-4" />
//           <span className="sr-only">Back</span>
//         </Button>
//         <div>
//           <h1 className="font-headline text-xl font-bold tracking-tight">
//             Add a New Testimonial
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Fill out the details for the new feedback.
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <Card>
//         <CardContent className="pt-6">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//                 {/* Left Column */}
//                 <div className="col-span-1 space-y-8 md:col-span-2">
//                   <FormField
//                     control={form.control}
//                     name="text"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Testimonial Content</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Write the patient's feedback here..."
//                             className="min-h-[200px]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Right Column */}
//                 <div className="col-span-1 space-y-8">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Patient Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="e.g., John D." {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="rating"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Rating</FormLabel>
//                         <FormControl>
//                           <div className="flex items-center gap-1">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <Star
//                                 key={star}
//                                 className={cn(
//                                   "h-6 w-6 cursor-pointer",
//                                   field.value >= star
//                                     ? "text-yellow-500 fill-yellow-500"
//                                     : "text-gray-300"
//                                 )}
//                                 onClick={() => field.onChange(star)}
//                               />
//                             ))}
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Status</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a status" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Pending">Pending</SelectItem>
//                             <SelectItem value="Approved">Approved</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="space-y-2">
//                     <FormLabel>Patient Photo</FormLabel>
//                     <FormField
//                       control={form.control}
//                       name="avatar"
//                       render={({ field }) => (
//                         <FormItem className="!space-y-0">
//                           <FormControl>
//                             <Input
//                               type="file"
//                               onChange={(e) => field.onChange(e.target.files)}
//                               accept="image/*"
//                             />
//                           </FormControl>
//                           <FormDescription className="pt-2">
//                             Optional: Upload a photo of the patient.
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   type="button"
//                   onClick={() => router.push("/testimonials")}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Saving..." : "Add Testimonial"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



'use client';

import TestimonialForm from "../TestimonialForm";

export default function NewTestimonialPage() {
  return <TestimonialForm />;
}
