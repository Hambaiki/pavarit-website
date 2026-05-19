import { cn } from "@/lib/cn";

import { ImageRender } from "../ui";

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundImage?: string;
  speed?: number;
}

export default function Hero({
  children,
  className,
  backgroundImage,
  speed = 60,
  ...props
}: HeroProps) {
  return (
    <div
      id="hero"
      className={cn(
        "hero-layout-size",
        "px-6 py-20",
        "flex flex-col justify-center items-center",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 w-[200%] h-full flex animate-hero-scroll-x"
            style={{ animationDuration: `${speed}s` }}
          >
            <ImageRender
              src={backgroundImage}
              alt="Hero Background"
              className="object-cover w-1/2 h-full"
            />
            <ImageRender
              src={backgroundImage}
              alt="Hero Background"
              className="object-cover w-1/2 h-full"
            />
          </div>

          <div className="absolute inset-0 bg-decorative-black/70" />
        </>
      )}

      {children && (
        <header className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          {children}
        </header>
      )}
    </div>
  );
}
