import Link from "next/link";

import { IconType } from "react-icons";
import { FaChevronRight } from "react-icons/fa6";

interface OptionMenuGridProps {
  items: {
    title: string;
    description: string;
    href: string;
    icon: IconType;
  }[];
}

function OptionMenuGrid({ items }: OptionMenuGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      {items.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className="flex flex-row items-center space-x-4 p-4 rounded-lg
          bg-gray-850 hover:bg-gray-800 transition-colors"
        >
          <item.icon className="text-suzuha-teal-500 w-5 h-5" />

          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-base">{item.description}</p>
          </div>

          <FaChevronRight className="text-suzuha-teal-500" />
        </Link>
      ))}
    </div>
  );
}

export default OptionMenuGrid;
