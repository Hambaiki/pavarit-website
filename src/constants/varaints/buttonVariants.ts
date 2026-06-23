import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "text-sm text-center font-normal",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200 cursor-pointer",
  ],
  {
    variants: {
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-2.5 text-base rounded-xl",
        lg: "px-8 py-3 text-md rounded-2xl",
      },
      variant: {
        solid: [
          "bg-primary-500 text-white",
          "hover:bg-primary-600",
          "active:bg-primary-700",
          "focus-visible:ring-primary-200",
        ],
        outline: [
          "border border-gray-300 bg-transparent text-gray-900",
          "hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900",
          "active:border-gray-500 active:bg-gray-100 active:text-gray-900",
          "focus-visible:ring-primary-200",
        ],
        ghost: [
          "p-0",
          "bg-transparent text-gray-900",
          "hover:text-primary-600",
          "active:text-primary-700",
          "focus-visible:ring-primary-200",
        ],
        gradient: [
          "border border-primary-300 text-gray-900 bg-primary-100/40",
          "hover:bg-primary-100/60",
          "active:bg-primary-200/50",
          "focus-visible:ring-primary-200 backdrop-blur",
        ],
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);
