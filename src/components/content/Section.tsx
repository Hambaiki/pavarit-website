import { cn } from "@/lib/cn";

const sectionVariants = {
  default: "py-10 px-4 md:px-10 lg:py-16 lg:px-16 max-w-[1480px]",
  wide: "p-8 max-w-none",
  edge: "py-8 max-w-none",
};

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof sectionVariants;
}

export default function Section({
  children,
  className,
  variant = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("mx-auto", sectionVariants[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}
