"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import CarousalContainer from "../container/CarousalContainer";

interface PhotosCarousalProps {
  images: {
    src: string;
    alt: string;
    description: string;
  }[];
}

function PhotosCarousal({ images }: PhotosCarousalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-850 rounded-xl p-4">
      <motion.div
        className="flex flex-col justify-center gap-2 lg:p-4 min-h-[10rem] text-left"
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h3 className="text-2xl lg:text-3xl">{images[currentIndex].alt}</h3>
        <p>{images[currentIndex].description}</p>
      </motion.div>

      <CarousalContainer
        autoScroll
        autoScrollInterval={5000}
        onIndexChange={setCurrentIndex}
        showIndicator={false}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={1000}
            height={1000}
            className="w-full h-96 lg:h-80 object-cover rounded-lg"
          />
        ))}
      </CarousalContainer>
    </div>
  );
}

export default PhotosCarousal;
