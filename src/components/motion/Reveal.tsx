"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  once?: boolean;
}

export function Reveal({ children, once = false, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: once }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
