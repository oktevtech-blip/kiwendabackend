// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// import {
//   Card,
//   CardContent,
//   CardFooter
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger
// } from "@/components/ui/tabs";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";

// import { Upload, MoreVertical } from "lucide-react";

// // ✅ Define the shape of gallery items
// interface GalleryItem {
//   image_id?: number;
//   title?: string;
//   category?: string;
//   image_url: string;
//   uploaded_by?: number;
//   uploaded_at?: string;
// }

// // ✅ Backend base URL
// const BASE_URL = "http://localhost:5000";

// export default function GalleryPage() {
//   const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
//   const [categories, setCategories] = useState<string[]>(["All"]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch gallery images
//   useEffect(() => {
//     const fetchGallery = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/gallery`);
//         if (!res.ok) throw new Error("Failed to fetch images");
//         const data: GalleryItem[] = await res.json();

//         // Set images and categories
//         setGalleryImages(data);
//         const uniqueCats = Array.from(new Set(data.map((img) => img.category))).filter(Boolean);
//         setCategories(["All", ...uniqueCats]);
//       } catch (err) {
//         console.error("Error fetching gallery:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGallery();
//   }, []);

//   // ✅ Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <p className="text-muted-foreground text-lg">Loading gallery...</p>
//       </div>
//     );
//   }

//   // ✅ No images state
//   if (!galleryImages.length) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
//         <p className="text-muted-foreground text-lg">No images found.</p>
//         <Button asChild>
//           <Link href="/gallery/new">
//             <Upload className="mr-2 h-4 w-4" />
//             Upload New Image
//           </Link>
//         </Button>
//       </div>
//     );
//   }

//   // ✅ Page layout
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-headline text-2xl font-bold tracking-tight">
//             Image Gallery Manager
//           </h2>
//           <p className="text-muted-foreground">
//             Upload, update, or remove photos from your website.
//           </p>
//         </div>

//         <Button asChild>
//           <Link href="/gallery/new">
//             <Upload className="mr-2 h-4 w-4" />
//             Upload Image
//           </Link>
//         </Button>
//       </div>

//       {/* Tabs for categories */}
//       <Tabs defaultValue="All" className="w-full">
//         <TabsList>
//           {categories.map((cat) => (
//             <TabsTrigger key={cat} value={cat}>
//               {cat}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {categories.map((cat) => (
//           <TabsContent key={cat} value={cat}>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {galleryImages
//                 .filter((img) => cat === "All" || img.category === cat)
//                 .map((image, index) => (
//                   <Card key={image.image_id ?? index} className="group overflow-hidden">
//                     <CardContent className="relative p-0">
//                       {/* ✅ Construct full URL for images */}
//                       <Image
//                         src={`${BASE_URL}${image.image_url}`}
//                         alt={image.title ?? "Gallery image"}
//                         width={600}
//                         height={400}
//                         className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                       />

//                       {/* Dropdown actions */}
//                       <div className="absolute right-2 top-2">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="secondary"
//                               size="icon"
//                               className="h-8 w-8 rounded-full bg-background/70 hover:bg-background"
//                             >
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>

//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuItem>Edit Details</DropdownMenuItem>
//                             <DropdownMenuItem>Set as Hero Image</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem className="text-destructive">
//                               Delete Image
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </CardContent>

//                     <CardFooter className="p-4">
//                       <div>
//                         <p className="font-semibold">{image.title ?? "Untitled"}</p>
//                         <p className="text-sm text-muted-foreground">{image.category ?? "Uncategorized"}</p>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Upload, MoreVertical } from "lucide-react";

// ✅ Define the shape of gallery items
interface GalleryItem {
  image_id?: number;
  title?: string;
  category?: string;
  image_url: string;
  uploaded_by?: number;
  uploaded_at?: string;
}

// ✅ Backend base URL
const BASE_URL = "http://localhost:5000";

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${BASE_URL}/gallery`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data: GalleryItem[] = await res.json();

        // Set images and categories
        setGalleryImages(data);
        const uniqueCats = Array.from(new Set(data.map((img) => img.category))).filter(Boolean);
        setCategories(["All", ...uniqueCats]);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ✅ Delete image handler
  const handleDelete = async (id?: number) => {
    if (!id) return alert("Invalid image ID");

    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${BASE_URL}/gallery/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete image");

      // Remove image from state instantly
      setGalleryImages((prev) => prev.filter((img) => img.image_id !== id));
      alert("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground text-lg">Loading gallery...</p>
      </div>
    );
  }

  // ✅ No images state
  if (!galleryImages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-muted-foreground text-lg">No images found.</p>
        <Button asChild>
          <Link href="/gallery/new">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Image
          </Link>
        </Button>
      </div>
    );
  }

  // ✅ Page layout
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Image Gallery Manager
          </h2>
          <p className="text-muted-foreground">
            Upload, update, or remove photos from your website.
          </p>
        </div>

        <Button asChild>
          <Link href="/gallery/new">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Link>
        </Button>
      </div>

      {/* Tabs for categories */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {galleryImages
                .filter((img) => cat === "All" || img.category === cat)
                .map((image, index) => (
                  <Card key={image.image_id ?? index} className="group overflow-hidden">
                    <CardContent className="relative p-0">
                      {/* ✅ Construct full URL for images */}
                      <Image
                        src={`${BASE_URL}${image.image_url}`}
                        alt={image.title ?? "Gallery image"}
                        width={600}
                        height={400}
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Dropdown with only Delete */}
                      <div className="absolute right-2 top-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-background/70 hover:bg-background"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => handleDelete(image.image_id)}
                            >
                              Delete Image
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4">
                      <div>
                        <p className="font-semibold">{image.title ?? "Untitled"}</p>
                        <p className="text-sm text-muted-foreground">
                          {image.category ?? "Uncategorized"}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
