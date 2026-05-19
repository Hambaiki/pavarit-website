"use client";

import { Children } from "react";

import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/cn";

interface InfiniteMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
  reverse?: boolean;
  className?: string;
  copies?: number | "dynamic";
  targetItemCount?: number;
  gap?: number | string;
}

export default function InfiniteMarquee({
  children,
  duration = 30,
  reverse = false,
  className = "",
  copies = "dynamic",
  targetItemCount = 10,
  gap = "1rem",
  ...props
}: InfiniteMarqueeProps) {
  const mounted = useHasMounted();

  const items = Children.toArray(children);

  const resolvedCopies =
    copies === "dynamic"
      ? Math.ceil(targetItemCount / Math.max(items.length, 1))
      : Math.max(1, copies);

  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden mask-fade-x",
        className
      )}
      {...props}
    >
      <div
        className="flex items-center w-max"
        style={{
          gap: gapValue,
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: mounted ? "running" : "paused",
        }}
      >
        {Array.from({ length: resolvedCopies }).flatMap((_, copyIndex) =>
          items.map((child, index) => (
            <div
              key={`${copyIndex}-${index}`}
              className="shrink-0"
              aria-hidden={copyIndex > 0}
            >
              {child}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
