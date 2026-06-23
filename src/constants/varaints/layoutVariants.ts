import { cva } from "class-variance-authority";

export const layoutVariants = cva([], {
  variants: {
    variant: {
      default: "py-6 px-4 md:px-8 max-w-6xl",
      wide: "p-8 max-w-none",
      edge: "py-8 max-w-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
