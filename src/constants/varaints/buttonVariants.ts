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
          "bg-background-fill-brand-light-default text-typography-strong",
          "hover:bg-background-fill-brand-deep-hovered",
          "active:bg-background-fill-brand-deep-pressed",
          "focus-visible:ring-focus-brand-light",
        ],
        outline: [
          "border border-outline-strong bg-transparent text-typography-strong",
          "hover:border-outline-medium hover:bg-background-surface-default hover:text-black",
          "active:border-outline-strong active:bg-transparent active:text-typography-strong",
          "focus-visible:ring-white",
        ],
        ghost: [
          "p-0",
          "bg-transparent text-typography-strong",
          "hover:text-background-surface-brand-light-pressed",
          "active:text-background-surface-brand-light-pressed",
          "focus-visible:ring-focus-brand-light",
        ],
        gradient: [
          "border-gradient text-typography-strong bg-decorative-brand-light/20",
          "hover:bg-decorative-white/20",
          "active:bg-decorative-brand-light/30",
          "focus-visible:ring-focus-brand-light backdrop-blur",
        ],
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);
