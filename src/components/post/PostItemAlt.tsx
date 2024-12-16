import Image from "next/image";

import { format } from "date-fns";

import { FaCalendar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

interface PostItemAltProps {
  image?: string;
  title?: string;
  author?: string;
  createDate?: string;
  tags?: string[];
  disableHover?: boolean;
  className?: string;
}

function PostItemAlt({
  image,
  title,
  author = "Unknown",
  createDate = "",
  tags = [],
  disableHover = false,
  className,
}: PostItemAltProps) {
  return (
    <article
      className={`flex flex-col w-full h-full space-y-4 justify-between p-4 rounded-xl
        ${
          disableHover
            ? "bg-neutral-900"
            : "bg-neutral-900 hover:bg-neutral-950 transition-colors"
        } ${className}`}
    >
      <Image
        src={image || "/images/placeholder/placeholder-image.jpg"}
        alt={title || "no-title"}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex flex-col space-y-3 text-sm">
        <address className="flex flex-col space-y-2">
          <p className="flex flex-row items-center text-white not-italic">
            <FaUser className="mr-2" />
            {author}
          </p>
          <p className="flex flex-row items-center text-white not-italic">
            <FaCalendar className="mr-2" />
            {format(new Date(createDate), "yyyy/MM/dd")}
          </p>
        </address>

        <ul className="flex flex-row flex-wrap gap-2">
          {tags
            .filter((tag) => !tag.startsWith("_"))
            .map((tag, index) => (
              <li
                key={index}
                className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
              >
                {tag}
              </li>
            ))}
        </ul>
      </div>
    </article>
  );
}

export default PostItemAlt;
