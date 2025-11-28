"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroAdmin() {
  const [currentHero, setCurrentHero] = useState<{ image?: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Fetch the current hero image
  useEffect(() => {
    fetch("https://kiwendaserver.onrender.com/hero")
      .then((res) => res.json())
      .then((data) => setCurrentHero(data));
  }, []);

  // Upload handler
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

      // Re-fetch updated hero image after upload
      const res2 = await fetch("https://kiwendaserver.onrender.com/hero");
      const updatedHero = await res2.json();
      setCurrentHero(updatedHero);
    } else {
      alert("Failed to update hero image");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Hero Image</h1>

      {currentHero?.image && (
        <div className="mb-6">
          <p className="mb-2 text-muted-foreground">Current Hero Image:</p>
          <Image
            src={`data:image/jpeg;base64,${currentHero.image}`}
            alt="Hero"
            width={600}
            height={300}
            className="rounded-md shadow"
          />
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFile(e.target.files?.[0] || null)
          }
          className="block w-full border border-gray-300 rounded p-2"
        />
        <Button type="submit" className="w-full">
          Upload New Hero Image
        </Button>
      </form>
    </div>
  );
}
