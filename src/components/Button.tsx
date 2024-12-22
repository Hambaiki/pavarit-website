"use client";

import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}

function Button({
  id,
  children,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
  href,
  onClick,
}: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={`${className} flex transition-colors items-center justify-center text-center disabled:cursor-not-allowed
          ${
            variant === "primary" &&
            "border border-suzuha-teal-500 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 disabled:bg-neutral-500 disabled:text-neutral-300 disabled:border-neutral-500 text-white"
          }
          ${
            variant === "secondary" &&
            "border border-suzuha-teal-500 bg-transparent hover:bg-suzuha-teal-500/10 disabled:text-neutral-300 disabled:border-neutral-500 text-suzuha-teal-500"
          }
          ${
            variant === "tertiary" &&
            "underline underline-offset-1 text-suzuha-teal-500 disabled:text-neutral-300"
          }
      `}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} transition-colors disabled:cursor-not-allowed
        ${
          variant === "primary" &&
          "border border-suzuha-teal-500 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 disabled:bg-neutral-500 disabled:text-neutral-300 disabled:border-neutral-500 text-white"
        }
        ${
          variant === "secondary" &&
          "border border-suzuha-teal-500 bg-transparent hover:bg-suzuha-teal-500/10 disabled:text-neutral-300 disabled:border-neutral-500 text-suzuha-teal-500"
        }
        ${
          variant === "tertiary" &&
          "underline underline-offset-1 text-suzuha-teal-500 disabled:text-neutral-300"
        }
      `}
    >
      {children}
    </button>
  );
}

export default Button;
