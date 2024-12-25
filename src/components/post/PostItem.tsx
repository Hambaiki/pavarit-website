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
}

function PostItem({
  image,
  title,
  author = "Unknown",
  createDate = "",
  tags = [],
  description = "No description",
  hideDescription = false,
  className,
  loading = false,
}: PostItemProps) {
  return (
    <div className={`rounded-xl transition-colors ${className}`}>
      <article className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          {loading ? (
            <div className="w-full h-48 md:h-full bg-gray-850 rounded-lg animate-pulse" />
          ) : (
            <Image
              src={image || "/images/placeholder/placeholder-image.jpg"}
              alt={title || "placeholder"}
              width={500}
              height={500}
              className="w-full h-48 md:h-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col justify-between p-4 bg-gray-850 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          {!loading ? (
            <div className="flex-1 flex flex-col space-y-3">
              <h3>{title || "-"}</h3>

              <address className="flex flex-row items-center space-x-4 text-sm">
                <p className="flex flex-row items-center not-italic">
                  <FaUser className="mr-2" />
                  {author || "-"}
                </p>
                <p className="flex flex-row items-center not-italic">
                  <FaCalendar className="mr-2" />
                  {createDate
                    ? format(new Date(createDate), "yyyy/MM/dd")
                    : "-"}
                </p>
              </address>

              {tags && (
                <ul className="flex flex-row flex-wrap gap-2">
                  {tags
                    .filter((tag) => !tag.includes("_"))
                    .map((tag, index) => (
                      <li
                        key={index}
                        className="text-sm rounded-full px-3 py-1 bg-gray-800"
                      >
                        {tag}
                      </li>
                    ))}
                </ul>
              )}

              {!hideDescription && (
                <div className="flex-1 rounded-xl">
                  <p className="line-clamp-4">
                    {description || "No description"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="h-8 w-full rounded-full animate-pulse bg-gray-850" />
              <div className="h-8 w-1/2 rounded-full animate-pulse bg-gray-850" />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default PostItem;
