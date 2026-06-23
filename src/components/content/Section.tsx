import { VariantProps } from "class-variance-authority";

import { layoutVariants } from "@/constants/varaints/layoutVariants";
import { cn } from "@/lib/cn";

interface SectionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof layoutVariants> {}

export default function Section({
  children,
  className,
  variant,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("mx-auto", layoutVariants({ variant }), className)}
      {...props}
    >
      {children}
    </section>
  );
}
