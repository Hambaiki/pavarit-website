import Image from "next/image";

import { format } from "date-fns";

import { FaCalendar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

interface PostItemProps {
  image?: string;
  title?: string;
  author?: string;
  createDate?: string;
  tags?: string[];
  description?: string;
  hideDescription?: boolean;
  className?: string;
  loading?: boolean;
  tagsLimit?: number;
  orientation?: "horizontal" | "vertical";
}

function PostItem({
  image,
  title,
  author = "Unknown",
  createDate = "",
  tags = [],
  description = "",
  className,
  loading = false,
  tagsLimit = 3,
  orientation = "horizontal",
}: PostItemProps) {
  const filteredTags = tags.filter((tag) => !tag.includes("_"));

  return (
    <article
      className={`flex
        ${className || ""}
        ${orientation === "horizontal" ? "flex-row" : "flex-col"}`}
    >
      <div
        className={`overflow-hidden min-h-[10rem] ${
          orientation === "horizontal"
            ? "rounded-l-xl h-full w-1/3"
            : "rounded-t-xl h-48 w-full"
        }`}
      >
        {true ? (
          <div className="w-full h-full bg-gray-900 animate-pulse" />
        ) : (
          <Image
            src={image || "/images/placeholder/placeholder-image.jpg"}
            alt={title || "placeholder"}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div
        className={`flex-1 flex flex-col justify-between p-4 bg-gray-850 ${
          orientation === "horizontal" ? "rounded-r-xl" : "rounded-b-xl"
        }`}
      >
        {true ? (
          <div className="w-full h-full bg-gray-850 animate-pulse" />
        ) : (
          <div className="grow space-y-3">
            <h3 className="text-xl">{title || "-"}</h3>

            <address className="flex flex-row items-center space-x-4 text-sm">
              <p className="flex flex-row items-center not-italic truncate">
                <FaUser className="mr-2" />
                <span className="truncate">{author || "-"}</span>
              </p>
              <p className="flex flex-row items-center not-italic">
                <FaCalendar className="mr-2" />
                {createDate ? format(new Date(createDate), "yyyy/MM/dd") : "-"}
              </p>
            </address>

            {filteredTags.length > 0 && (
              <ul className="flex flex-row flex-wrap gap-2">
                {filteredTags.slice(0, tagsLimit).map((tag, index) => (
                  <li
                    key={index}
                    className="text-sm rounded-full px-3 py-1 bg-gray-800"
                  >
                    {tag}
                  </li>
                ))}
                {filteredTags.length > tagsLimit && (
                  <li className="text-sm rounded-full px-3 py-1 bg-gray-800">
                    +{filteredTags.length - tagsLimit}
                  </li>
                )}
              </ul>
            )}

            {description && (
              <div className="flex-1">
                <p className="line-clamp-4">
                  {description || "No description"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default PostItem;
