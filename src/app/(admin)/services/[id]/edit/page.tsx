// 'use client';

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";

// type Service = {
//   name: string;
//   description: string;
//   long_description?: string;
//   category: string;
//   status: string;
//   icon?: string;
// };

// export default function EditServicePage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [service, setService] = useState<Service | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchService = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/services/${id}`);
//         const data = res.data;
//         setService({
//           name: data.name,
//           description: data.description,
//           long_description: data.long_description || data.longDescription || "",
//           category: data.category,
//           status: data.status,
//           icon: data.icon || "",
//         });
//       } catch (err) {
//         console.error("❌ Error fetching service:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchService();
//   }, [id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     if (!service) return;
//     const { name, value } = e.target;
//     setService({ ...service, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!service) return;
//     setSaving(true);

//     try {
//       await axios.put(`http://localhost:5000/services/${id}`, {
//         name: service.name,
//         description: service.description,
//         longDescription: service.long_description,
//         category: service.category,
//         status: service.status,
//         icon: service.icon,
//       });

//       alert("✅ Service updated successfully!");
//       router.push(`/services`);
//     } catch (err) {
//       console.error("❌ Error updating service:", err);
//       alert("Failed to update service");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
//         <Loader2 className="h-6 w-6 mr-2 animate-spin" /> Loading service details...
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
//         <p className="mb-4 text-lg">Service not found.</p>
//         <Button asChild>
//           <Link href="/services">Go Back</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <Card className="shadow-lg border rounded-2xl">
//         <CardHeader>
//           <CardTitle>Edit Service</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block font-medium">Name</label>
//               <Input name="name" value={service.name} onChange={handleChange} required />
//             </div>

//             <div>
//               <label className="block font-medium">Description</label>
//               <Textarea
//                 name="description"
//                 value={service.description}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block font-medium">Full Description</label>
//               <Textarea
//                 name="long_description"
//                 value={service.long_description || ""}
//                 onChange={handleChange}
//                 rows={6}
//               />
//             </div>

//             <div>
//               <label className="block font-medium">Category</label>
//               <Input name="category" value={service.category} onChange={handleChange} required />
//             </div>

//             <div>
//               <label className="block font-medium">Status</label>
//               <Input name="status" value={service.status} onChange={handleChange} required />
//             </div>

//             <div className="flex justify-end mt-6 space-x-3">
//               <Button asChild variant="outline">
//                 <Link href={`/services/${id}`}>Cancel</Link>
//               </Button>
//               <Button type="submit" disabled={saving}>
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Service = {
  name: string;
  description: string;
  long_description?: string;
  category: string;
  status: string;
  icon?: string;
};

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/services/${id}`);
        const data = res.data;
        setService({
          name: data.name,
          description: data.description,
          long_description: data.long_description || data.long_description || "",
          category: data.category,
          status: data.status,
          icon: data.icon || "",
        });
      } catch (err) {
        console.error("❌ Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!service) return;
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setSaving(true);

    try {
      await axios.put(`http://localhost:5000/services/${id}`, {
        name: service.name,
        description: service.description,
        long_description: service.long_description,
        category: service.category,
        status: service.status,
        icon: service.icon,
      });

      alert("✅ Service updated successfully!");
      router.push("/services");
    } catch (err) {
      console.error("❌ Error updating service:", err);
      alert("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

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
        <Button onClick={() => router.push("/services")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Name</label>
              <Input name="name" value={service.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <Textarea
                name="description"
                value={service.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block font-medium">Full Description</label>
              <Textarea
                name="long_description"
                value={service.long_description || ""}
                onChange={handleChange}
                rows={6}
              />
            </div>

            <div>
              <label className="block font-medium">Category</label>
              <Input name="category" value={service.category} onChange={handleChange} required />
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <Input name="status" value={service.status} onChange={handleChange} required />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/services")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
