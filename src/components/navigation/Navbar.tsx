"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { FaBars } from "react-icons/fa6";

import { navItems } from "@/constants/common";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";

export default function Navbar() {
  const pathname = usePathname();

  const [stackOpen, setStackOpen] = useState(false);

  useEffect(() => {
    setStackOpen(false);
  }, [pathname]);

  return (
    <div className="w-full bg-neutral-900 shadow-xl">
      <div className="flex flex-row items-start justify-between max-w-5xl mx-auto p-4 md:p-8 space-x-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">PAVARIT W.</h1>
          <hr className="border-2 border-suzuha-teal-500" />
        </div>

        <nav className="hidden md:flex flex-row justify-end items-center space-x-4">
          {navItems.map((item, index) => {
            const current = pathname === `${item.href}`;

            return (
              <Link
                key={index}
                href={`${item.href}`}
                className={`px-4 py-2 rounded-full w-28
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

      <div className="md:hidden max-w-4xl mx-auto bg-neutral-950">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 p-4">
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
