"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";

import StackButton from "@/components/common/StackButton";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarVerticalItem from "@/components/navigation/NavbarVerticalItem";
import { DASHBOARD_NAV_ITEMS } from "@/constants/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

interface DashboardNavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function DashboardNavbar({
  className,
  ...props
}: DashboardNavbarProps) {
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
      className={cn(
        "transition-colors md:border-b",
        stackOpen ? "bg-white border-gray-200" : "border-transparent",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center h-full md:h-auto">
        <div className="md:hidden mr-4 md:mr-0">
          <StackButton onClick={() => setStackOpen(!stackOpen)} />
        </div>

        <div className="p-2 lg:p-4">
          <h1 className="text-3xl font-bold">PAVARIT</h1>
          <hr className="border-2 border-primary-500" />
          <span className="text-lg font-extralight">Dashboard</span>
        </div>
      </div>

      <nav className="hidden md:flex flex-col gap-2 rounded-2xl">
        {DASHBOARD_NAV_ITEMS.map((item, index) => (
          <NavbarVerticalItem key={index} item={item} />
        ))}
      </nav>

      <div className="md:hidden max-w-4xl mx-auto">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 pt-4">
            {DASHBOARD_NAV_ITEMS.map((item, index) => (
              <NavbarVerticalItem key={index} item={item} />
            ))}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}
