"use client";

import { type ComponentPropsWithoutRef, type MouseEventHandler } from "react";

import Link from "next/link";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-center transition-colors disabled:cursor-not-allowed data-[disabled=true]:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "border border-primary-500 bg-primary-500 text-white hover:bg-primary-600 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 data-[disabled=true]:border-gray-200 data-[disabled=true]:bg-gray-200 data-[disabled=true]:text-gray-500",
        secondary:
          "border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500/10 disabled:border-gray-400 disabled:text-gray-500 data-[disabled=true]:border-gray-400 data-[disabled=true]:text-gray-500",
        tertiary:
          "text-primary-500 underline underline-offset-1 disabled:text-gray-500 data-[disabled=true]:text-gray-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonAsButtonProps = ButtonVariantProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
    children: React.ReactNode;
    className?: string;
  };

type ButtonAsLinkProps = ButtonVariantProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: ComponentPropsWithoutRef<typeof Link>["href"];
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function Button({
  children,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const { href, onClick, tabIndex, ...linkProps } = props;

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Link
        href={href}
        onClick={handleClick}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : tabIndex}
        data-disabled={disabled ? "true" : "false"}
        className={cn(buttonVariants({ variant }), className)}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const { onClick, type, ...buttonProps } = props;

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant }), className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default Button;
