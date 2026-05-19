import { cn } from "@/lib/cn";

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `border-8 border-gray-200 border-t-primary-500 rounded-full w-16 h-16 animate-spin`,
        className
      )}
    />
  );
}

export default Spinner;
