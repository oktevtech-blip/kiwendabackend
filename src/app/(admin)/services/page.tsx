'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Service = {
  service_id: number;
  name: string;
  description: string;
  category: string;
  status: string;
  image_url?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // ✅ Fetch all services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/services");
        setServices(res.data);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ✅ Handle Delete
  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await axios.delete(`http://localhost:5000/services/${selectedService.service_id}`);
      setServices((prev) =>
        prev.filter((s) => s.service_id !== selectedService.service_id)
      );
      setIsDialogOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error("❌ Error deleting service:", err);
    }
  };

  // ✅ Navigate to View page
  const handleView = (id: number) => {
    router.push(`/services/${id}`);
  };

  // ✅ Navigate to Edit page
  const handleEdit = (id: number) => {
    router.push(`/services/${id}/view`);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading services...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Manage Services</CardTitle>
            <CardDescription>
              Add, edit, or remove rehabilitation services offered.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/services/new">Add New Service</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service, index) => (
              <TableRow key={service.service_id ?? `${service.name}-${index}`}>
                <TableCell className="hidden sm:table-cell">
                  {service.image_url ? (
                    <Image
                      src={
                        service.image_url.startsWith("http")
                          ? service.image_url
                          : `http://localhost:5000/uploads/${service.image_url}`
                      }
                      alt={service.name}
                      width={64}
                      height={64}
                      className="aspect-square rounded-md object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.png"
                      alt="No image"
                      width={64}
                      height={64}
                      className="aspect-square rounded-md object-cover"
                    />
                  )}
                </TableCell>

                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>

                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={
                      service.status?.toLowerCase() === "active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      service.status?.toLowerCase() === "active"
                        ? "bg-green-600 text-white"
                        : ""
                    }
                  >
                    {service.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => handleEdit(service.service_id)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setSelectedService(service);
                          setIsDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* ✅ Global Delete Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service{" "}
              <span className="font-semibold">
                {selectedService?.name ?? ""}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
