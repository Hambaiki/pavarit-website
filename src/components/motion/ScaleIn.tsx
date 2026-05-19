"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  delay?: number;
  once?: boolean;
}

export function ScaleIn({
  children,
  once = false,
  delay = 0,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: once, amount: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
