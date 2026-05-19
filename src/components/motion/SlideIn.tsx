"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

interface SlideInProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  delay?: number;
  once?: boolean;
  direction?: Direction;
}

export function SlideIn({
  children,
  delay = 0,
  once = false,
  direction = "up",
  ...props
}: SlideInProps) {
  const offsets: Record<Direction, { x?: number; y?: number }> = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ amount: 0, once }}
      transition={{
        type: "spring",
        // NOTE: Alt values to experiment with
        stiffness: 140,
        damping: 26,
        mass: 1,
        // stiffness: 120,
        // damping: 22,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
