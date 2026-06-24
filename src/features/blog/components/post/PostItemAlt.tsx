import Image from "next/image";

import * as changeCase from "change-case";
import { format } from "date-fns";
import { FaCalendar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

import { cn } from "@/lib/cn";

interface PostItemAltProps {
  image?: string;
  title?: string;
  author?: string;
  createDate?: string | null;
  tags?: string[];
  disableHover?: boolean;
  className?: string;
  loading?: boolean;
}

function PostItemAlt({
  image,
  title,
  author = "Unknown",
  createDate = "",
  tags = [],
  className,
}: PostItemAltProps) {
  const filteredTags = tags.filter((tag) => !tag.includes("_"));

  return (
    <article
      className={cn(`flex flex-col w-full h-full justify-between`, className)}
    >
      <Image
        src={image || "/images/placeholder/placeholder-image.jpg"}
        alt={title || "no-title"}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-t-xl"
        loading="eager"
      />

      <div className="flex-1 p-4 card rounded-b-xl space-y-2">
        <h3>{title}</h3>

        <div className="flex flex-col space-y-3 text-sm">
          <address className="flex flex-row items-center space-x-2">
            <p className="flex flex-row items-center not-italic">
              <FaUser className="mr-2" />
              {author}
            </p>
            <p className="flex flex-row items-center not-italic">
              <FaCalendar className="mr-2" />
              {createDate ? format(new Date(createDate), "yyyy/MM/dd") : "N/A"}
            </p>
          </address>

          <ul className="flex flex-row flex-wrap gap-2">
            {filteredTags.map((tag, index) => (
              <li key={index} className="rounded-full px-3 py-1 bg-gray-200">
                {changeCase.capitalCase(tag)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default PostItemAlt;
