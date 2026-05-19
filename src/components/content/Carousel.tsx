"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { cn } from "@/lib/cn";

import { Button } from "../ui";

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnManualNav?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function Carousel({
  children,
  autoPlay = true,
  autoPlayInterval = 5000,
  pauseOnManualNav = 3000,
  showDots = true,
  showArrows = true,
  className,
  ...props
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number | "auto">("auto");

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  const childrenArray = useMemo(
    () => React.Children.toArray(children) ?? [],
    [children]
  );
  const totalSlides = useMemo(() => childrenArray.length, [childrenArray]);

  // Start the autoplay interval
  const startInterval = useCallback(() => {
    if (!autoPlay || totalSlides <= 1) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, totalSlides]);

  // On manual nav: clear existing interval, pause, then restart fresh after delay
  const resetInterval = useCallback(() => {
    if (!autoPlay) return;

    isPausedRef.current = true;

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
      startInterval();
    }, pauseOnManualNav);
  }, [autoPlay, pauseOnManualNav, startInterval]);

  // Boot the interval on mount
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [startInterval]);

  useEffect(() => {
    const heights = slideRefs.current
      .filter((ref): ref is HTMLDivElement => ref !== null)
      .map((ref) => ref.offsetHeight);

    if (heights.length > 0) setMaxHeight(Math.max(...heights));
  }, [childrenArray]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    resetInterval();
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      {...props}
    >
      {/* Carousel Container */}
      <div
        className="relative w-full flex items-center"
        style={{ height: maxHeight }}
      >
        {childrenArray.map((child, index) => {
          const offset = index - currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className={cn(
                "absolute left-0 w-full transition-all duration-500 ease-in-out",
                isActive ? "z-10" : "z-0",
                Math.abs(offset) > 1 && "opacity-0",
                isActive ? "opacity-100" : "opacity-20"
              )}
              style={{
                transform: `translateX(${offset * 60}%) scale(${isActive ? 1 : 0.85})`,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <Button
            variant="ghost"
            onClick={goToPrevious}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-8 h-8 text-white" />
          </Button>
          <Button
            variant="ghost"
            onClick={goToNext}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-8 h-8 text-white" />
          </Button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer",
                index === currentIndex
                  ? "bg-typography-brand-light"
                  : "bg-typography-disabled hover:bg-typography-medium"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
