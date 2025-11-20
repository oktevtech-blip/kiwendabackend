"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Testimonial {
  testimonial_id: number;
  patient_name: string;
  message: string;
  photo_url?: string;
  rating: number;
  status: string;
  created_at?: string;
}

const API_URL = "http://localhost:5000";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Testimonial | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`${API_URL}/testimonials`);
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data: Testimonial[] = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("❌ Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      setTestimonials((prev) => prev.filter((t) => t.testimonial_id !== id));
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">Loading testimonials...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Testimonials
          </h2>
          <p className="text-muted-foreground">
            Manage patient or family feedback for the website.
          </p>
        </div>
        <Button asChild>
          <Link href="/testimonials/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No testimonials found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.testimonial_id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        t.photo_url && !t.photo_url.startsWith("http")
                          ? `${API_URL}${t.photo_url.startsWith("/") ? "" : "/"}${t.photo_url}`
                          : t.photo_url || "/default-avatar.png"
                      }
                      alt={t.patient_name}
                    />
                    <AvatarFallback>
                      {t.patient_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{t.patient_name}</CardTitle>
                    {t.created_at && (
                      <CardDescription>
                        {format(new Date(t.created_at), "PPP")}
                      </CardDescription>
                    )}
                  </div>
                </div>

                {/* Dropdown Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* ✅ View Action */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          onClick={() => setSelected(t)}
                        >
                          View
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{t.patient_name}</DialogTitle>
                          <DialogDescription>
                            Testimonial Details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <img
                            src={
                              t.photo_url && !t.photo_url.startsWith("http")
                                ? `${API_URL}${t.photo_url.startsWith("/") ? "" : "/"}${t.photo_url}`
                                : t.photo_url || "/default-avatar.png"
                            }
                            alt={t.patient_name}
                            className="w-32 h-32 rounded-full object-cover mx-auto border"
                          />
                          <p className="text-center italic text-gray-600">
                            "{t.message}"
                          </p>
                          <div className="flex justify-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < t.rating ? "fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-center">
                            <span className="font-semibold">Status:</span>{" "}
                            <Badge
                              variant={
                                t.status === "Approved"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {t.status}
                            </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 🗑️ Delete Action */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the testimonial from "
                            {t.patient_name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(t.testimonial_id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent>
                <p className="italic text-foreground/80">{t.message}</p>
              </CardContent>

              <CardFooter className="flex justify-between">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < t.rating ? "fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Badge
                  variant={t.status === "Approved" ? "default" : "secondary"}
                  className={
                    t.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {t.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
