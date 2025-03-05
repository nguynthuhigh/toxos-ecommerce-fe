"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col-reverse">
      <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
        <div
          className="grid grid-cols-4 gap-6"
          aria-orientation="horizontal"
          role="tablist"
        >
          {images.map((image, index) => (
            <button
              key={`gallery-image-${index}`}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50",
                selectedImage === index
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-gray-200"
              )}
              role="tab"
              aria-selected={selectedImage === index}
              aria-controls={`product-image-${index}`}
            >
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                  width={200}
                  height={200}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="aspect-h-1 aspect-w-1 w-full">
        <div
          id={`product-image-${selectedImage}`}
          role="tabpanel"
          className="relative h-full w-full sm:rounded-lg"
        >
          <Image
            src={images[selectedImage]}
            alt={`Product image ${selectedImage + 1}`}
            className="h-full w-full object-cover object-center sm:rounded-lg"
            width={600}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
}
