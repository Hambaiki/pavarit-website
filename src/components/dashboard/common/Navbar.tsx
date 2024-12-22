"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { FaBars } from "react-icons/fa";

import { dashboardNavItems } from "@/constants/navigation";

import { useClickOutside } from "@/hooks/useClickOutside";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarVerticalItem from "@/components/navigation/NavbarVerticalItem";

function Navbar() {
  const [stackOpen, setStackOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useClickOutside(ref, () => {
    setStackOpen(false);
  });

  useEffect(() => {
    setStackOpen(false);

    if (!window) return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div
      ref={ref}
      className="fixed top-0 md:left-0 w-full md:w-64 h-28 md:h-full z-10 
        text-white bg-primary-gray-background/90 backdrop-blur"
    >
      <div className="flex flex-row items-center p-4 h-full md:h-auto">
        <div className="md:hidden mr-4 md:mr-0">
          <button
            onClick={() => setStackOpen(!stackOpen)}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-1 md:space-y-2 px-2 lg:p-4">
          <h1 className="text-2xl font-bold text-white">PAVARIT W.</h1>
          <hr className="border-2 border-suzuha-teal-500" />
          <h1 className="text-lg font-extralight">Dashboard</h1>
        </div>
      </div>

      <nav className="hidden md:flex flex-col gap-2 p-4 rounded-2xl">
        {dashboardNavItems.map((item, index) => (
          <NavbarVerticalItem key={index} item={item} />
        ))}
      </nav>

      <div className="md:hidden max-w-4xl mx-auto bg-neutral-900">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 p-4">
            {dashboardNavItems.map((item, index) => (
              <NavbarVerticalItem key={index} item={item} />
            ))}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}

export default Navbar;
