import { useEffect } from "react";
import type { RefObject } from "react";

// Custom hook for handling click outside of the referenced element
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
) => {
  useEffect(() => {
    // Event handler for click events
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(); // Call the provided callback if the click was outside the element
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
