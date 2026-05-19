"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { FaRedoAlt } from "react-icons/fa";
import {
  FaCalendar,
  FaChevronDown,
  FaCircleArrowDown,
  FaClock,
  FaEllipsisVertical,
  FaEye,
  FaPencil,
  FaTrash,
  FaUpload,
  FaUser,
} from "react-icons/fa6";

import Button from "@/components/Button";
import GeneralModal from "@/components/common/GeneralModal";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

interface PostItemProps {
  id?: number;
  image?: string;
  slug?: string;
  title?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  description?: string;
  views?: number;
  hideDescription?: boolean;
  className?: string;
  onDelete?: (id: number) => void;
}

function PostItem({
  id,
  image,
  slug,
  title,
  author = "Unknown",
  createdAt = "",
  updatedAt = "",
  tags = [],
  description = "No description",
  views = 0,
  hideDescription = false,
  className,
  onDelete,
}: PostItemProps) {
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  useClickOutside(ref, () => setMenuCollapsed(true));

  return (
    <div
      ref={ref}
      onClick={() => setMenuCollapsed(!menuCollapsed)}
      className={cn(
        `p-3 card rounded-xl transition-all cursor-pointer hover:shadow-md`,
        className
      )}
    >
      <div className="flex flex-row gap-4 h-32">
        <div className="md:block hidden w-36 overflow-hidden">
          <Image
            src={image || "/images/placeholder/placeholder-image.jpg"}
            alt={title || "placeholder"}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 flex flex-col space-y-3 truncate">
          <div className="flex-1 flex flex-col space-y-2">
            <p className="text-lg font-semibold truncate">{title || "-"}</p>

            <address className="flex flex-row items-center space-x-4 text-sm">
              {/* <p className="flex flex-row items-center text-gray-700 not-italic">
                <FaUser className="mr-2" />
                {author || "-"}
              </p> */}
              <p className="flex flex-row items-center text-gray-700 not-italic">
                <FaUpload className="mr-2" />
                {createdAt ? format(new Date(createdAt), "yyyy/MM/dd") : "-"}
              </p>
              <p className="flex flex-row items-center text-gray-700 not-italic">
                <FaRedoAlt className="mr-2" />
                {updatedAt ? format(new Date(updatedAt), "yyyy/MM/dd") : "-"}
              </p>
              <p className="flex flex-row items-center text-gray-700 not-italic">
                <FaEye className="mr-2" />
                {views}
              </p>
            </address>
          </div>

          {tags && (
            <ul className="flex flex-row flex-wrap gap-2">
              {tags.slice(0, 1).map((tag, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 rounded-full px-3 py-1 bg-gray-200"
                >
                  {tag}
                </li>
              ))}
              {tags.length > 1 && (
                <li className="text-sm text-gray-600 rounded-full px-3 py-1 bg-gray-200">
                  + {tags.length - 1}
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="flex flex-row space-x-2 px-2 py-1 items-center justify-center">
          <span className="text-sm md:block hidden">Options</span>
          <FaChevronDown
            className={`h-5 w-5 ${menuCollapsed ? "rotate-180" : ""}`}
          />
        </div>

        {/* {!hideDescription && (
          <div className="flex-1 p-4 bg-gray-200 rounded-xl">
            <p className="text-gray-300 line-clamp-4">{description}</p>
          </div>
        )} */}
      </div>

      <CollapsibleContainer collapsed={menuCollapsed}>
        <div className="flex flex-row justify-end space-x-2 p-2 mt-3 bg-gray-100 rounded-lg">
          <button
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-red-500 hover:bg-red-500/20 transition-colors"
            onClick={() => setConfirmDelete(true)}
          >
            <FaTrash className="text-red-500" />
            <span className="hidden md:block text-sm text-red-500">Delete</span>
          </button>

          <Link
            href={`/dashboard/posts/edit?id=${id}`}
            prefetch={false}
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-primary-500 hover:bg-primary-500/20 transition-colors"
          >
            <FaPencil className="text-primary-500" />
            <span className="hidden md:block text-sm text-primary-500">
              Edit
            </span>
          </Link>

          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-gray-400 hover:bg-gray-200 transition-colors"
          >
            <FaEye className="text-gray-700" />
            <span className="hidden md:block text-sm text-gray-700">View</span>
          </Link>
        </div>
      </CollapsibleContainer>

      <GeneralModal
        title="Delete Post"
        message="Are you sure you want to delete this post?"
        onClickPrimary={() => id && onDelete?.(id)}
        onClickSecondary={() => setConfirmDelete(false)}
        onClickOutside={() => setConfirmDelete(false)}
        visible={confirmDelete}
      />
    </div>
  );
}

export default PostItem;
