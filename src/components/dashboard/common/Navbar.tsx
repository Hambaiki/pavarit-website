"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/constants/navigation";

import { useClickOutside } from "@/hooks/useClickOutside";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarVerticalItem from "@/components/navigation/NavbarVerticalItem";
import StackButton from "@/components/common/StackButton";

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
      className="fixed top-0 md:left-0 w-full md:w-72 h-24 md:h-full z-10 md:border-r border-gray-850 bg-background-dark/90 backdrop-blur"
    >
      <div className="flex flex-row items-center py-4 px-8 h-full md:h-auto">
        <div className="md:hidden mr-4 md:mr-0">
          <StackButton onClick={() => setStackOpen(!stackOpen)} />
        </div>

        <div className="px-2 lg:p-4">
          <h1 className="text-3xl font-bold">PAVARIT</h1>
          <hr className="border-2 border-suzuha-teal-500" />
          <span className="text-lg font-extralight">Dashboard</span>
        </div>
      </div>

      <nav className="hidden md:flex flex-col gap-2 px-8 rounded-2xl">
        {dashboardNavItems.map((item, index) => (
          <NavbarVerticalItem key={index} item={item} />
        ))}
      </nav>

      <div className="md:hidden max-w-4xl mx-auto bg-gray-950">
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
