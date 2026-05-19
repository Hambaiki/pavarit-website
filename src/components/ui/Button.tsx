import { ButtonHTMLAttributes, ComponentProps, forwardRef } from "react";

import { type VariantProps } from "class-variance-authority";

import { Link } from "@/components/ui";
import { buttonVariants } from "@/constants/varaints/buttonVariants";
import { cn } from "@/lib/cn";

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  ComponentProps<typeof Link> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, children, href, ...props }, ref) => {
    if (href) {
      const { href: _href, ...linkProps } = props as ComponentProps<
        typeof Link
      >;

      return (
        <Link
          {...linkProps}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(buttonVariants({ variant, size }), className)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
