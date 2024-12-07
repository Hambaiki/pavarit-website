import Link from "next/link";

import { FaChevronRight } from "react-icons/fa";

interface BreadcrumbsProps {
  breadcrumbs: { label: string; href: string }[];
}

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <div className="flex flex-row space-x-2 px-4 py-2 bg-neutral-900 rounded-xl">
      {breadcrumbs.map((breadcrumb, index) => (
        <Link
          key={breadcrumb.href}
          href={breadcrumb.href}
          className="text-neutral-300 hover:text-neutral-100 transition-colors"
        >
          {breadcrumb.label}
          {index !== breadcrumbs.length - 1 && (
            <FaChevronRight className="text-neutral-300 inline ml-2" />
          )}
        </Link>
      ))}
    </div>
  );
}

export default Breadcrumbs;
