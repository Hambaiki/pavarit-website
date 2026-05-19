"use client";

import { useEffect, useRef, useState } from "react";

import { useScroll } from "framer-motion";

export function useScrollDirection() {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    return scrollY.on("change", (current) => {
      if (current > lastY.current) {
        setDirection("down");
      } else if (current < lastY.current) {
        setDirection("up");
      }
      lastY.current = current;
    });
  }, [scrollY]);

  return direction;
}
