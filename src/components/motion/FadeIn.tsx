"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  delay?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  once = false,
  delay = 0,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: once, amount: 0, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
