"use client";

import { useEffect, useState } from "react";

import { FaChevronUp } from "react-icons/fa6";

import { cn } from "@/lib/cn";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg",
        "bg-white border border-gray-200 text-gray-600",
        "hover:bg-gray-100 transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="sr-only">Back to top</span>
      <FaChevronUp className="w-5 h-5" />
    </button>
  );
}

export default BackToTop;
