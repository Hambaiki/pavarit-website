import { cn } from "@/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full px-2 bg-decorative-white/10 border border-outline-brand-deep typography-caption text-typography-medium ml-2",
        className
      )}
    >
      {children}
    </div>
  );
}
