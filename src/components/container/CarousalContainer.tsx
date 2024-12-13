"use client";

import { useState } from "react";

interface CarousalContainerProps {
  className?: string;
  children: React.ReactNode[];
}

function CarousalContainer({ className, children }: CarousalContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.target as HTMLElement;

    const scrollPosition = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);

    setCurrentIndex(newIndex);
  };

  const scrollToProfile = (index: number) => {
    const container = document.getElementById("carousal-container");

    if (container) {
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={className}>
      <div
        id="carousal-container"
        className="flex flex-row space-x-8 overflow-x-scroll scrollbar-none snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {children.map((child, index) => (
          <div className="min-w-full snap-center" key={index}>
            {child}
          </div>
        ))}
      </div>

      {children.length > 1 && (
        <div className="flex justify-center space-x-3 mt-4 overflow-y-auto scrollbar-hide">
          {children.map((_, index) => (
            <button
              key={index}
              className={`h-4 w-4 rounded-full shrink-0 ${
                index === currentIndex ? "bg-neutral-500" : "bg-neutral-300"
              }`}
              onClick={() => scrollToProfile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarousalContainer;
