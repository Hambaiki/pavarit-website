"use client";

import { useRef, useState } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import ModalContainer from "@/components/container/ModalContainer";
import { useClickOutside } from "@/hooks/useClickOutside";

import { ImageRender } from "../../../../components/ui";

type PostImageViewerProps = {
  htmlContent: string;
};

const PostImageViewer = ({ htmlContent }: PostImageViewerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState<number>();

  const handleClose = () => {
    setIndex(undefined);
  };

  const extractImageUrlsAndAlts = (
    htmlString: string
  ): { src: string; alt: string }[] => {
    // This regex captures <img> tags, finding src and optionally alt in any order
    const imgTagRegex =
      /<img[^>]+src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?/g;
    const imageData: { src: string; alt: string }[] = [];
    let match;

    // Find all matches of <img> tags
    while ((match = imgTagRegex.exec(htmlString)) !== null) {
      imageData.push({
        src: match[1], // Extract src value
        alt: match[2] || "post-image", // Extract alt value, default to empty string if missing
      });
    }

    return imageData;
  };

  useClickOutside(ref, handleClose);

  const images = extractImageUrlsAndAlts(htmlContent);

  return (
    <>
      <div
        className={`p-4 bg-white rounded-lg drop-shadow-2xl drop-shadow-primary_blue-100 ${
          images.length > 0 ? "block" : "hidden"
        }`}
      >
        <p className="font-semibold text-lg">
          Total Image(s) ({images.length})
        </p>

        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2 mt-2">
          {/* To update to proper src */}
          {images.slice(0, 3).map((image, index) => (
            <button
              className="grow rounded-lg border border-primary_blue-100 overflow-hidden"
              key={index}
              onClick={() => setIndex(index)}
            >
              <ImageRender
                src={image.src}
                alt={image.alt}
                width={64}
                height={64}
                className="h-32 w-full object-cover hover:brightness-[.9] transition"
              />
            </button>
          ))}

          {images.length > 3 && (
            <button
              onClick={() => setIndex(3)}
              className="relative rounded-lg border border-primary_blue-100 overflow-hidden"
            >
              <ImageRender
                src={images[3].src}
                alt={images[3].alt + "-overflow"}
                width={64}
                height={64}
                className="h-32 w-full object-cover brightness-[.5] hover:brightness-[.4] transition"
              />

              <p
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                          font-bold text-2xl text-white"
              >
                + {images.length - 3}
              </p>
            </button>
          )}
        </div>
      </div>

      <ModalContainer
        visible={index != undefined}
        onClickOutside={() => setIndex(undefined)}
        className="w-full max-w-3xl"
      >
        {/* fix button logic, use on click outside instead? */}
        {index !== undefined && (
          <div className="flex flex-row justify-center">
            <button
              className="flex shrink-0 items-center justify-center w-12"
              onClick={() => setIndex(index - 1)}
              disabled={index == 0}
            >
              <FaChevronLeft
                className="w-3 h-3"
                color={index == 0 ? "gray" : "white"}
              />
            </button>

            <div>
              <ImageRender
                src={images[index].src}
                alt={images[index].alt}
                width={512}
                height={512}
                className="w-auto h-auto rounded-2xl"
              />
            </div>

            <button
              className="flex shrink-0 items-center justify-center w-12"
              onClick={() => setIndex(index + 1)}
              disabled={index == images.length - 1}
            >
              <FaChevronRight
                className="w-3 h-3"
                color={index == images.length - 1 ? "gray" : "white"}
              />
            </button>
          </div>
        )}
      </ModalContainer>
    </>
  );
};

export default PostImageViewer;
