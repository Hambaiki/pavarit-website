"use client";

import clsx from "clsx";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-accent bg-accent hover:bg-accent-hover disabled:bg-surface-muted disabled:text-content-muted disabled:border-border-strong text-on-accent",
  secondary:
    "border border-accent bg-transparent hover:bg-accent/10 disabled:text-content-muted disabled:border-border-strong text-accent",
  tertiary:
    "underline underline-offset-1 text-accent disabled:text-content-muted",
};

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
  const variantClassName = variantClasses[variant];

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center justify-center text-center transition-colors disabled:cursor-not-allowed",
          variantClassName,
          className,
        )}
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
      className={clsx(
        "transition-colors disabled:cursor-not-allowed",
        variantClassName,
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;
