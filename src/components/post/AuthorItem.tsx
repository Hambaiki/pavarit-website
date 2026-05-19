import { format } from "date-fns";
import { FaCalendar, FaUser } from "react-icons/fa";

import Card from "@/components/ui/Card";

interface AuthorItemProps {
  author: string;
  createdAt: string;
}

function AuthorItem({ author, createdAt }: AuthorItemProps) {
  return (
    <Card
      as="address"
      className="flex flex-row items-center space-x-4 p-4 mb-4"
    >
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
    </Card>
  );
}

export default AuthorItem;
