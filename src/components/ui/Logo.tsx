import { cn } from "@/lib/cn";

import { ImageRender } from "../ui";

interface LogoProps {
  variant?: "PRIMARY" | "SECONDARY";
  className?: string;
}

const Logo = ({ variant = "PRIMARY", className }: LogoProps) => {
  return (
    <ImageRender
      src={`/assets/images/logo/${
        variant == "PRIMARY" ? "logo-primary.webp" : "logo-secondary.webp"
      }`}
      alt="Turning Tables Games Logo"
      className={cn(className, "w-12 h-12")}
      // width={48}
      // height={48}
      // optimized
    />
  );
};

export default Logo;
