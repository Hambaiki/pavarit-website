"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useRef, useState } from "react";

import {
  FaCalendar,
  FaEllipsisVertical,
  FaTrash,
  FaUser,
  FaPencil,
  FaChevronDown,
  FaClock,
  FaCircleArrowDown,
  FaUpload,
  FaEye,
} from "react-icons/fa6";

import Button from "@/components/Button";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import { FaRedoAlt } from "react-icons/fa";
import GeneralModal from "@/components/common/GeneralModal";
import { useClickOutside } from "@/hooks/useClickOutside";

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
      className={`p-3 rounded-xl bg-neutral-900 transition-colors cursor-pointer ${className}`}
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
            <h2 className="text-lg font-semibold truncate">{title || "-"}</h2>

            <address className="flex flex-row items-center space-x-4 text-sm">
              {/* <p className="flex flex-row items-center text-white not-italic">
                <FaUser className="mr-2" />
                {author || "-"}
              </p> */}
              <p className="flex flex-row items-center text-white not-italic">
                <FaUpload className="mr-2" />
                {createdAt ? format(new Date(createdAt), "yyyy/MM/dd") : "-"}
              </p>
              <p className="flex flex-row items-center text-white not-italic">
                <FaRedoAlt className="mr-2" />
                {updatedAt ? format(new Date(updatedAt), "yyyy/MM/dd") : "-"}
              </p>
              <p className="flex flex-row items-center text-white not-italic">
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
                  className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                >
                  {tag}
                </li>
              ))}
              {tags.length > 1 && (
                <li className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800">
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
          <div className="flex-1 p-4 bg-neutral-800 rounded-xl">
            <p className="text-neutral-300 line-clamp-4">{description}</p>
          </div>
        )} */}
      </div>

      <CollapsibleContainer collapsed={menuCollapsed}>
        <div className="flex flex-row justify-end space-x-2 p-2 mt-2 bg-neutral-950 rounded-lg">
          <button
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-red-500 hover:bg-red-500/20 transition-colors"
            onClick={() => setConfirmDelete(true)}
          >
            <FaTrash className="text-red-500" />
            <span className="hidden md:block text-sm text-red-500">Delete</span>
          </button>

          <button
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-suzuha-teal-500 hover:bg-suzuha-teal-500/20 transition-colors"
            onClick={() => router.push(`/dashboard/posts/edit?id=${id}`)}
          >
            <FaPencil className="text-suzuha-teal-500" />
            <span className="hidden md:block text-sm text-suzuha-teal-500">
              Edit
            </span>
          </button>

          <button
            className="flex flex-row items-center space-x-2 px-4 py-2 rounded-lg 
              border border-white hover:bg-white/20 transition-colors"
            onClick={() => router.push(`/blog/${slug}`)}
          >
            <FaEye className="text-white" />
            <span className="hidden md:block text-sm text-white">View</span>
          </button>
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
