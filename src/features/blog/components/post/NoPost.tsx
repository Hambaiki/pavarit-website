import { FaQuestionCircle } from "react-icons/fa";

interface NoPostProps {
  search?: string;
}

export default function NoPost({ search }: NoPostProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-2">
      <FaQuestionCircle className="h-12 w-12 text-gray-500" />
      <p className="text-lg font-medium">
        {search ? "No posts found" : "No posts yet"}
      </p>
      <p className="text-sm text-gray-500">
        {search
          ? `We couldn't find any posts matching "${search}".`
          : "Check back soon for new content."}
      </p>
    </div>
  );
}
