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
    <div
      className={`p-4 rounded-xl bg-neutral-900 hover:bg-neutral-950 transition-colors ${className}`}
    >
      <article className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="overflow-hidden">
          {loading ? (
            <div className="w-full h-48 md:h-full bg-neutral-800 rounded-lg animate-pulse" />
          ) : (
            <Image
              src={image || "/images/placeholder/placeholder-image.jpg"}
              alt={title || "placeholder"}
              width={500}
              height={500}
              className="w-full h-48 md:h-full object-cover rounded-lg"
            />
          )}
        </div>

        {!loading ? (
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-semibold">{title || "-"}</h2>

            <address className="flex flex-row items-center space-x-4 text-sm">
              <p className="flex flex-row items-center text-white not-italic">
                <FaUser className="mr-2" />
                {author || "-"}
              </p>
              <p className="flex flex-row items-center text-white not-italic">
                <FaCalendar className="mr-2" />
                {createDate ? format(new Date(createDate), "yyyy/MM/dd") : "-"}
              </p>
            </address>

            {tags && (
              <ul className="flex flex-row flex-wrap gap-2">
                {tags
                  .filter((tag) => !tag.includes("_"))
                  .map((tag, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                    >
                      {tag}
                    </li>
                  ))}
              </ul>
            )}

            {!hideDescription && (
              <div className="flex-1 p-4 bg-neutral-800 rounded-xl">
                <p className="text-neutral-300 line-clamp-4">
                  {description || "No description"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <div className="h-8 w-full bg-neutral-800 rounded-full animate-pulse" />
            <div className="h-8 w-1/2 bg-neutral-800 rounded-full animate-pulse" />
          </div>
        )}
      </article>
    </div>
  );
}

export default PostItem;
