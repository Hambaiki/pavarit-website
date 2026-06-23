"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import { navItems } from "@/constants/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

import StackButton from "../common/StackButton";
import NavbarItem from "./NavbarItem";
import NavbarVerticalItem from "./NavbarVerticalItem";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Navbar({ className, ...props }: NavbarProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const [stackOpen, setStackOpen] = useState(false);

  const closeStack = useCallback(() => setStackOpen(false), []);
  useClickOutside(ref, closeStack);

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
      className={cn(
        "w-full transition-colors md:border-b",
        stackOpen ? "bg-white border-gray-200" : "border-transparent",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="md:hidden mr-4 md:mr-0">
            <StackButton onClick={() => setStackOpen(!stackOpen)} />
          </div>

          <Link href="/" className="space-y-0">
            <span className="text-xl md:text-2xl font-bold">PAVARIT</span>
            <hr className="border-2 border-primary-500" />
          </Link>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <nav className="hidden md:flex flex-row justify-end items-center space-x-2">
            {navItems.map((item, index) => (
              <NavbarItem key={index} item={item} />
            ))}
          </nav>
        </div>
      </div>

      <div className="md:hidden max-w-4xl mx-auto">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 pt-4">
            {navItems.map((item, index) => (
              <NavbarVerticalItem key={index} item={item} />
            ))}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}
