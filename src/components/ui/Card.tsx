import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

function Card({ children, className, as: Tag = "div" }: CardProps) {
  return <Tag className={cn("card rounded-xl", className)}>{children}</Tag>;
}

export default Card;
