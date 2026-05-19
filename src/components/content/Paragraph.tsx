import { cn } from "@/lib/cn";

import { Typography } from "../ui";

export default function Paragraph({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Typography
      {...props}
      className={cn(
        "[p+&]:mt-16 max-w-250 mx-auto",
        "text-center text-typography-weak font-medium",
        className
      )}
      variant="body1"
    >
      {children}
    </Typography>
  );
}
