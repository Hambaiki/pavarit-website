import { VariantProps } from "class-variance-authority";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { layoutVariants } from "@/constants/varaints/layoutVariants";
import { cn } from "@/lib/cn";
import { BreadcrumbItem } from "@/types/common";

interface HeaderProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "description">,
    VariantProps<typeof layoutVariants> {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function Header({
  title,
  description,
  breadcrumbs,
  className,
  children,
  variant,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn("mx-auto", layoutVariants({ variant }), className)}
      {...props}
    >
      {breadcrumbs && (
        <Breadcrumbs className="mb-8" breadcrumbs={breadcrumbs} />
      )}

      <div className="flex flex-col space-y-4">
        <h1>{title}</h1>
        {description && <p className="mt-4">{description}</p>}
      </div>

      {/* Additional content */}
      {children}
    </header>
  );
}
