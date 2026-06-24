"use client";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/cn";

interface PostImageProps {
  image: string;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

const PostImage = ({
  image,
  title,
  className,
  width,
  height,
}: PostImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn(`relative overflow-hidden`, className)}>
      {/* Loading State */}
      {isLoading && (
        <div
          className={cn(
            `absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse`
          )}
        />
      )}

      {/* Image Component */}
      <Image
        src={image}
        alt={title}
        width={width}
        height={height}
        layout="intrinsic"
        className={cn(`${isLoading ? "opacity-0" : "opacity-100"}`)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default PostImage;
