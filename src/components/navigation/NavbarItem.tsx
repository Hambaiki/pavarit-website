"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

interface NavbarItemProps {
  item: {
    label: string;
    href: string;
    subItems?: { label: string; href: string }[];
  };
}

function NavbarItem({ item }: NavbarItemProps) {
  const pathname = usePathname();

  const current =
    pathname === item.href ||
    item.subItems?.some((subItem) => pathname === subItem.href);

  return (
    <div className={cn(`group relative w-24`)}>
      <Link
        href={`${item.href}`}
        className={cn(
          `w-full h-full px-4 py-2 rounded-full transition-colors duration-300 text-center inline-block`,
          current ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-50"
        )}
      >
        <span className={cn(current ? "text-primary-500" : "")}>
          {item.label}
        </span>
      </Link>

      {item.subItems && item.subItems.length > 0 && (
        <div
          className={cn(
            `absolute top-full left-1/2 transform -translate-x-1/2 pt-2 z-10`,
            `opacity-0 group-hover:opacity-100`,
            `pointer-events-none group-hover:pointer-events-auto`,
            `transition-all duration-100 origin-top`
          )}
        >
          <div className="flex flex-col justify-start items-center min-w-32 shadow-xl bg-white border border-gray-200 rounded-xl max-h-64 overflow-y-auto overflow-x-hidden">
            {item.subItems.map((subItem, subIndex) => {
              return (
                <Link
                  key={subIndex}
                  href={`${subItem.href}`}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                >
                  {subItem.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarItem;
