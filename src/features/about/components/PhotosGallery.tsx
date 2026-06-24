"use client";

import { useState } from "react";

import Image from "next/image";

import { FaChevronLeft, FaChevronRight, FaXmark } from "react-icons/fa6";

import ModalContainer from "@/components/container/ModalContainer";
import Card from "@/components/ui/Card";
import { PhotoItem } from "@/types/common";

interface PhotosGalleryProps {
  images: PhotoItem[];
}

function PhotosGallery({ images }: PhotosGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hasSelection = selectedIndex !== null;

  const selectedImage = hasSelection ? images[selectedIndex] : null;

  const closeModal = () => setSelectedIndex(null);

  const moveImage = (step: number) => {
    if (selectedIndex === null) return;
    const nextIndex = selectedIndex + step;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setSelectedIndex(nextIndex);
  };

  return (
    <>
      <Card className="p-4 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative overflow-hidden rounded-xl text-left"
              aria-label={`View photo details for ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={1200}
                className="w-full h-72 md:h-80 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="eager"
              />

              <div
                className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
              />

              <div
                className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/45 to-transparent
                opacity-100 transition-opacity duration-200"
              />

              <div className="absolute inset-0 flex items-end p-4 text-white">
                <div className="w-full">
                  <h3 className="text-base md:text-lg font-semibold line-clamp-1">
                    {image.alt}
                  </h3>
                  <p
                    className="mt-1 text-sm text-white line-clamp-2 overflow-hidden max-h-0 opacity-0
                    transition-all duration-200 group-hover:max-h-12 group-hover:opacity-100"
                  >
                    {image.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <ModalContainer
        visible={hasSelection}
        onClickOutside={closeModal}
        className="p-4"
      >
        {selectedImage && selectedIndex !== null && (
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-form-menu-border
            bg-form-menu-bg shadow-2xl"
          >
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1800}
                height={1200}
                className="w-full max-h-[65vh] object-cover"
                loading="eager"
              />

              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 rounded-full bg-black/55 p-2 text-white hover:bg-black/70 transition"
                aria-label="Close gallery modal"
              >
                <FaXmark className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => moveImage(-1)}
                disabled={selectedIndex === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white
                hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Previous image"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => moveImage(1)}
                disabled={selectedIndex === images.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white
                hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Next image"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-2">
              <p className="text-sm text-form-helper-hint">
                Photo {selectedIndex + 1} of {images.length}
              </p>
              <h3 className="text-xl md:text-2xl font-semibold">
                {selectedImage.alt}
              </h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        )}
      </ModalContainer>
    </>
  );
}

export default PhotosGallery;
