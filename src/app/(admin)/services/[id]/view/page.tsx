'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Service = {
  service_id: number;
  name: string;
  description: string;
  long_description?: string;
  //longDescription?: string; // 👈 handle both forms safely
  category: string;
  status: string;
  image_url?: string;
  icon?: string;
  created_at?: string;
};

export default function ViewServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/services/${id}`);
        // ✅ Normalize keys in case backend sends snake_case or camelCase inconsistently
        const data = res.data;
        const normalizedService: Service = {
          ...data,
          long_description: data.long_description || data.longDescription || "",
        };
        setService(normalizedService);
      } catch (err) {
        console.error("❌ Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <p className="mb-4 text-lg">Service not found.</p>
        <Button asChild>
          <Link href="/services">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="shadow-lg border rounded-2xl overflow-hidden">
        {service.image_url && (
          <Image
            src={service.image_url}
            alt={service.name}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
        )}

        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-2xl font-semibold">{service.name}</CardTitle>
              <CardDescription className="text-gray-600">{service.category}</CardDescription>
            </div>
            <Badge
              className={`${
                service.status.toLowerCase() === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              } px-3 py-1`}
            >
              {service.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{service.description}</p>

            {service.long_description && service.long_description.trim() !== "" && (
              <div>
                <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800">
                  Full Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {service.long_description}
                </p>
              </div>
            )}

            {service.created_at && (
              <p className="text-xs text-gray-500 mt-6">
                Added on: {new Date(service.created_at).toLocaleString()}
              </p>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <Button asChild variant="outline">
                <Link href="/services">Back to Services</Link>
              </Button>
              <Button asChild>
                <Link href={`/services/${service.service_id}/edit`}>Edit Service</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
