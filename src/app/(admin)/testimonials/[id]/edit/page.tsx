
// 'use client';

// import { TestimonialForm } from "@/app/(admin)/testimonials/new/page";

// const initialTestimonials = [
//     {
//         id: '1',
//         name: 'Sarah L.',
//         date: new Date('2024-07-20'),
//         status: 'Approved',
//         text: '"The team at Kiwenda was incredibly supportive throughout my recovery journey. I couldn\'t have done it without them. Highly recommended!"',
//         avatar: 'https://picsum.photos/seed/user1/40/40',
//         avatarHint: 'woman portrait',
//         rating: 5,
//     },
//     {
//         id: '2',
//         name: 'Michael B.',
//         date: new Date('2024-07-18'),
//         status: 'Approved',
//         text: '"A truly professional and caring environment. The physiotherapists are top-notch and helped me get back on my feet faster than I expected."',
//         avatar: 'https://picsum.photos/seed/user2/40/40',
//         avatarHint: 'man portrait',
//         rating: 5,
//     },
//     {
//         id: '3',
//         name: 'Anonymous',
//         date: new Date('2024-07-25'),
//         status: 'Pending',
//         text: '"Good service, but waiting times can be long."',
//         avatar: '',
//         avatarHint: '',
//         rating: 3,
//     }
// ];

// export default function EditTestimonialPage({ params }: { params: { id: string } }) {
//   const testimonial = initialTestimonials.find(t => t.id === params.id);
  
//   if (!testimonial) {
//     return <div>Testimonial not found.</div>;
//   }
  
//   return <TestimonialForm initialData={testimonial} isEditMode={true} />;
// }


"use client";

import { useEffect, useState } from "react";
import TestimonialForm from "../../TestimonialForm";

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const res = await fetch(`/api/testimonials/${id}`);
        if (!res.ok) throw new Error("Failed to load testimonial");

        const data = await res.json();

        setInitialData({
          testimonial_id: data.testimonial_id,
          name: data.name,
          message: data.message,
          status: data.status,
          rating: data.rating,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonial();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-500">Loading testimonial...</p>;
  if (!initialData) return <p className="p-4 text-red-500">Failed to load testimonial.</p>;

  return <TestimonialForm initialData={initialData} isEditMode={true} />;
}
