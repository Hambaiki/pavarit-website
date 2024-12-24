import Link from "next/link";

import { FaChevronRight } from "react-icons/fa";

interface BreadcrumbsProps {
  breadcrumbs: { label: string; href: string }[];
}

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <div className="flex flex-row flex-wrap bg-gray-900 rounded-xl px-4 py-2">
      {breadcrumbs.map((breadcrumb, index) => (
        <Link
          key={breadcrumb.href}
          href={breadcrumb.href}
          className={`transition-colors mr-2 ${
            index !== breadcrumbs.length - 1 ? "" : "text-suzuha-teal-500"
          }`}
        >
          {breadcrumb.label}
          {index !== breadcrumbs.length - 1 && (
            <FaChevronRight className="text-gray-300 inline ml-2" />
          )}
        </Link>
      ))}
    </div>
  );
}

export default Breadcrumbs;
