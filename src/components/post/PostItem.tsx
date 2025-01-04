import Image from "next/image";

import { format } from "date-fns";
import * as changeCase from "change-case";

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
  const tagsLimit = 3;
  const filteredTags = tags.filter((tag) => !tag.includes("_"));

  return (
    <div className={`rounded-xl transition-colors ${className}`}>
      <article className="flex flex-col md:grid md:grid-cols-2 h-full">
        <div className="overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          {loading ? (
            <div className="w-full h-48 md:h-full bg-gray-850 rounded-md animate-pulse" />
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

        <div className="flex-1 flex flex-col justify-between p-4 bg-gray-850 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          {!loading ? (
            <div className="flex-1 flex flex-col space-y-3">
              <h3 className="line-clamp-3">{title || "-"}</h3>

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

              {filteredTags.length > 0 && (
                <ul className="flex flex-row flex-wrap gap-2">
                  {filteredTags.slice(0, tagsLimit).map((tag, index) => (
                    <li
                      key={index}
                      className="text-sm rounded-full px-3 py-1 bg-gray-800"
                    >
                      {changeCase.capitalCase(tag)}
                    </li>
                  ))}
                  {filteredTags.length > tagsLimit && (
                    <li className="text-sm rounded-full px-3 py-1 bg-gray-800">
                      +{filteredTags.length - tagsLimit}
                    </li>
                  )}
                </ul>
              )}
              {!hideDescription && (
                <div className="flex-1 rounded-xl">
                  <p className="line-clamp-3">
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
