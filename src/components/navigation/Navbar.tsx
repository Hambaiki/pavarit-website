"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { navItems } from "@/constants/navigation";

import { useClickOutside } from "@/hooks/useClickOutside";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarItem from "./NavbarItem";
import NavbarVerticalItem from "./NavbarVerticalItem";
import StackButton from "../common/StackButton";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const [stackState, setStackState] = useState({
    pathname,
    open: false,
  });
  const stackOpen = stackState.pathname === pathname && stackState.open;

  useClickOutside(ref, () => {
    setStackState({ pathname, open: false });
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div
      ref={ref}
      className={`${className} fixed top-0 bg-canvas/90 backdrop-blur z-10 w-full`}
    >
      <div className="flex flex-row items-center justify-between max-w-6xl mx-auto px-4 md:px-8 space-x-8 h-20 md:h-24">
        <div className="flex flex-row items-center">
          <div className="md:hidden mr-4 md:mr-0">
            <StackButton
              onClick={() => setStackState({ pathname, open: !stackOpen })}
            />
          </div>

          <div className="space-y-0">
            <span className="text-xl md:text-2xl font-bold">PAVARIT</span>
            <hr className="border-2 border-accent" />
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <nav className="hidden md:flex flex-row justify-end items-center space-x-2">
            {navItems.map((item, index) => (
              <NavbarItem key={index} item={item} />
            ))}
          </nav>
        </div>
      </div>

      <div className="md:hidden max-w-4xl mx-auto bg-canvas">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 p-4">
            {navItems.map((item, index) => (
              <NavbarVerticalItem key={index} item={item} />
            ))}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}
