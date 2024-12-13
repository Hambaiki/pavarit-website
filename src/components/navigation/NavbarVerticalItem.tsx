"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import CollapsibleContainer from "../container/CollapsibleContainer";
import Link from "next/link";
import { useClickOutside } from "@/hooks/useClickOutside";

interface NavbarVerticalItemProps {
  item: {
    label: string;
    href: string;
    subItems: { label: string; href: string }[];
  };
}

function NavbarVerticalItem({ item }: NavbarVerticalItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const pathname = usePathname();
  const current = pathname === `${item.href}`;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(ref, () => setDropdownOpen(false));

  const handleClick = () => {
    if (item.subItems.length > 0) {
      setDropdownOpen(!dropdownOpen);
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={`flex-1 w-full
          transition-colors rounded-xl overflow-hidden
          ${current ? "bg-neutral-700" : "hover:bg-neutral-800"}
          ${
            dropdownOpen && !current
              ? "bg-neutral-800 hover:bg-neutral-800"
              : ""
          }`}
      >
        <button
          onClick={handleClick}
          className="flex flex-row items-center justify-between h-12 w-full px-6 py-2"
        >
          <span
            className={`${
              current ? "text-suzuha-teal-500" : "text-neutral-100"
            }`}
          >
            {item.label}
          </span>

          {item.subItems.length > 0 && (
            <FaChevronDown
              className={`w-4 h-4 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
            />
          )}
        </button>

        <CollapsibleContainer
          startCollapsed
          collapsed={!dropdownOpen}
          className="w-full"
        >
          {item.subItems.map((subItem, index) => (
            <Link key={index} href={subItem.href}>
              <div
                className={`flex flex-row items-center justify-between h-12 w-full px-6 py-2
                  transition-colors text-neutral-300
                  ${current ? "hover:bg-neutral-800" : "hover:bg-neutral-700"}`}
              >
                {subItem.label}
              </div>
            </Link>
          ))}
        </CollapsibleContainer>
      </div>
    </>
  );
}

export default NavbarVerticalItem;
