import { format } from "date-fns";

import { FaUser, FaCalendar } from "react-icons/fa";

interface AuthorItemProps {
  author: string;
  createdAt: string;
}

function AuthorItem({ author, createdAt }: AuthorItemProps) {
  return (
    <address className="flex flex-row items-center space-x-4 rounded-xl p-4 bg-gray-900 mb-4">
      <div className="text-sm space-y-2">
        <p className="flex flex-row items-center not-italic">
          <FaUser className="mr-2" />
          {author}
        </p>
        <p className="flex flex-row items-center not-italic">
          <FaCalendar className="mr-2" />
          {format(new Date(createdAt), "yyyy/MM/dd")}
        </p>
      </div>
    </address>
  );
}

export default AuthorItem;
