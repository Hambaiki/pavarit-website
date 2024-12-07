"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { FaBars } from "react-icons/fa6";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";

export default function Navbar() {
  const pathname = usePathname();

  const [stackOpen, setStackOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setStackOpen(false);
  }, [pathname]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between max-w-4xl mx-auto p-8 space-x-8">
        <h1 className="text-2xl font-bold text-suzuha-teal-500">Hambaiki</h1>

        <nav className="hidden md:flex flex-row justify-center items-center space-x-4 w-full max-w-xl">
          {navItems.map((item, index) => {
            const current = pathname === `${item.href}`;

            return (
              <Link
                key={index}
                href={`${item.href}`}
                className={`flex-1 px-4 py-2 rounded-full
                  transition-colors duration-300
                  text-center ${
                    current
                      ? "bg-neutral-700"
                      : "hover:bg-neutral-800 text-suzuha-pink-500"
                  }`}
              >
                <span
                  className={`${
                    current ? "text-suzuha-teal-500" : "text-neutral-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setStackOpen(!stackOpen)}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="md:hidden max-w-4xl mx-auto bg-neutral-900">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-4 p-8">
            {navItems.map((item, index) => {
              const current = pathname === `${item.href}`;

              return (
                <Link
                  key={index}
                  href={`${item.href}`}
                  className={`flex-1 w-full px-4 py-2 rounded-full
              transition-colors duration-300
              text-center ${
                current
                  ? "bg-neutral-700"
                  : "hover:bg-neutral-800 text-suzuha-pink-500"
              }`}
                >
                  <span
                    className={`${
                      current ? "text-suzuha-teal-500" : "text-neutral-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}
