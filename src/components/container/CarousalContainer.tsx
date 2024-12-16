"use client";

import { useEffect, useState } from "react";

interface CarousalContainerProps {
  className?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  children: React.ReactNode[];
}

function CarousalContainer({
  className,
  children,
  autoScroll = false,
  autoScrollInterval = 3000,
}: CarousalContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoScroll) {
      const interval = setInterval(() => {
        const nextIndex =
          currentIndex === children.length - 1 ? 0 : currentIndex + 1;

        scrollToProfile(nextIndex);
      }, autoScrollInterval);

      return () => clearInterval(interval);
    }
  }, [autoScroll, autoScrollInterval, currentIndex]);

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
                index === currentIndex ? "bg-suzuha-teal-500" : "bg-neutral-500"
              }`}
              onClick={() => scrollToProfile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CarousalContainer;
