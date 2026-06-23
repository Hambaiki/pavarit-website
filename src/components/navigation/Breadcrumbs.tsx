import Link from "next/link";

import { FaChevronRight } from "react-icons/fa";

import { cn } from "@/lib/cn";

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  breadcrumbs: { label: string; href: string }[];
}

function Breadcrumbs({ breadcrumbs, className, ...props }: BreadcrumbsProps) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2",
        className
      )}
      {...props}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Link
          key={`${index + 1}-${breadcrumb.href}`}
          href={breadcrumb.href}
          className={cn(
            "transition-colors mr-2",
            index !== breadcrumbs.length - 1 ? "" : "text-primary-500"
          )}
        >
          {breadcrumb.label}
          {index !== breadcrumbs.length - 1 && (
            <FaChevronRight className="text-gray-500 inline ml-2" />
          )}
        </Link>
      ))}
    </div>
  );
}

export default Breadcrumbs;
