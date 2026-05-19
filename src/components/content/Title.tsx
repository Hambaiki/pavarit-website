import { cn } from "@/lib/cn";

import { Typography } from "../ui";

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export default function Title({
  title,
  subtitle,
  className,
  ...props
}: TitleProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      <Typography variant="h3">{title}</Typography>

      {subtitle && (
        <Typography
          variant="body1"
          className={cn(
            "mt-8",
            "paragraph-layout-size",
            "text-typography-weak font-medium font-family-body"
          )}
        >
          {subtitle}
        </Typography>
      )}
    </div>
  );
}
