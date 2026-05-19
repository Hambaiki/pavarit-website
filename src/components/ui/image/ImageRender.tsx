"use client";

import { useState } from "react";

import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/cn";
import { checker } from "@/public/images/backgrounds";

import ImageErrorBoundary from "./ImageErrorBoundary";

interface ImageRenderProps extends Omit<ImageProps, "src"> {
  src?: ImageProps["src"];
  fileName?: string;
  basePath?: string;
  optimized?: boolean; // opt-in to next/image
}

export default function ImageRender({
  className,
  alt,
  src,
  fileName,
  basePath = "/assets/images",
  fill,
  width,
  height,
  optimized = false,
  ...props
}: ImageRenderProps) {
  const [useFallback, setUseFallback] = useState(false);

  const resolvedSrc = getResolvedSrc();
  const resolvedAlt = alt ?? fileName ?? "Image";

  function getResolvedSrc(): string {
    if (src) return src as string;
    if (fileName) return `${basePath}/${fileName}`;
    return checker.src;
  }

  const hasExplicitSize = width != null;
  const hasFill = fill != null;
  const hasSizing = hasExplicitSize || hasFill;

  // next/image requires: optimized flag + at least one sizing strategy
  const useNextImage = optimized && hasSizing && !useFallback;

  const sizeProps = hasExplicitSize ? { width, height } : { fill: true };

  const fallbackImg = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={resolvedAlt}
      className={cn("object-contain", className)}
      draggable={false}
      loading="lazy"
      decoding="async"
      {...(hasExplicitSize
        ? { width: Number(width), height: Number(height) }
        : {})}
    />
  );

  if (!useNextImage) {
    return fallbackImg;
  }

  return (
    <ImageErrorBoundary fallback={fallbackImg}>
      <Image
        src={resolvedSrc}
        alt={resolvedAlt}
        className={cn("object-contain", className)}
        draggable={false}
        onError={() => setUseFallback(true)}
        {...sizeProps}
        {...props}
      />
    </ImageErrorBoundary>
  );
}
