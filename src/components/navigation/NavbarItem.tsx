"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FadeInOutContainer from "../container/FadeInOutContainer";

interface NavbarItemProps {
  item: {
    label: string;
    href: string;
    subItems?: { label: string; href: string }[];
  };
}

function NavbarItem({ item }: NavbarItemProps) {
  const pathname = usePathname();

  const current = pathname === `${item.href}`;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className={`relative w-24`}
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <Link href={`${item.href}`}>
        <div
          className={`w-full h-full px-4 py-2 rounded-full
              transition-colors duration-300
              text-center ${
                current
                  ? "bg-neutral-700 hover:bg-neutral-900"
                  : "hover:bg-neutral-900"
              } `}
        >
          <span
            className={`${
              current ? "text-suzuha-teal-500" : "text-neutral-100"
            }`}
          >
            {item.label}
          </span>
        </div>
      </Link>

      {item.subItems && (
        <FadeInOutContainer visible={dropdownOpen}>
          <div className="absolute top-[115%] right-1/2 translate-x-1/2">
            <div className="flex flex-col justify-center items-center w-32 shadow-xl bg-black rounded-xl overflow-hidden">
              {item.subItems.map((subItem, subIndex) => {
                return (
                  <Link key={subIndex} href={`${subItem.href}`}>
                    <div
                      className="px-4 py-2 w-32 transition-colors text-center 
                     hover:bg-neutral-950"
                    >
                      <span>{subItem.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeInOutContainer>
      )}
    </div>
  );
}

export default NavbarItem;
