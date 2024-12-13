"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}

function Button({
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
        className={`${className} flex transition-colors items-center justify-center text-center
          ${
            variant === "primary" &&
            "border border-suzuha-teal-500 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 text-white"
          }
          ${
            variant === "secondary" &&
            "border border-suzuha-teal-500 bg-transparent hover:bg-suzuha-teal-500/10 text-suzuha-teal-500"
          }
          ${
            variant === "tertiary" &&
            "underline underline-offset-1 text-suzuha-teal-500"
          }
      `}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} transition-colors 
        ${
          variant === "primary" &&
          "border border-suzuha-teal-500 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 text-white"
        }
        ${
          variant === "secondary" &&
          "border border-suzuha-teal-500 bg-transparent hover:bg-suzuha-teal-500/10 text-suzuha-teal-500"
        }
        ${
          variant === "tertiary" &&
          "underline underline-offset-1 text-suzuha-teal-500"
        }
      `}
    >
      {children}
    </button>
  );
}

export default Button;
