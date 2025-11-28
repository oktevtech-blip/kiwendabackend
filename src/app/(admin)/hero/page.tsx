"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroAdmin() {
  const [currentHero, setCurrentHero] = useState<{ image?: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Fetch current hero image
  const loadHero = async () => {
    try {
      const res = await fetch("https://kiwendaserver.onrender.com/hero", {
        cache: "no-store",
      });
      const data = await res.json();
      setCurrentHero(data);
    } catch (error) {
      console.error("Error loading hero:", error);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  // Handle upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://kiwendaserver.onrender.com/hero/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Hero image updated!");
      loadHero(); // Refresh hero image
    } else {
      alert("Failed to update hero image");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Hero Image</h1>

      {/* Current hero image */}
      {currentHero?.image ? (
        <div className="mb-6">
          <p className="mb-2 text-muted-foreground">Current Hero Image:</p>
          <Image
            src={`data:image/jpeg;base64,${currentHero.image}`}
            alt="Hero"
            width={700}
            height={350}
            className="rounded-md shadow object-cover"
          />
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No hero image uploaded yet.</p>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full border border-gray-300 rounded p-2"
        />

        <Button type="submit" className="w-full">
          Upload New Hero Image
        </Button>
      </form>
    </div>
  );
}
