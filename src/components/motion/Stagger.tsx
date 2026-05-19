"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

interface StaggerProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  delay?: number;
  stagger?: number;
  once?: boolean;
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "ref"> {}

export function Stagger({
  children,
  delay = 0,
  stagger = 0.12,
  once = false,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, amount: 0 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
