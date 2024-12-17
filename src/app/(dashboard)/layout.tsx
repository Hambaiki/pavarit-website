"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarVerticalItem from "@/components/navigation/NavbarVerticalItem";

import { FaBars } from "react-icons/fa";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [stackOpen, setStackOpen] = useState(false);

  useClickOutside(ref, () => {
    setStackOpen(false);
  });

  useEffect(() => {
    setStackOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Home", href: "/dashboard" },
    {
      label: "Posts",
      href: "/dashboard/posts",
      subItems: [
        { label: "All Posts", href: "/dashboard/posts" },
        { label: "Create Post", href: "/dashboard/posts/create" },
        // { label: "Post Settings", href: "/dashboard/posts/settings" },
      ],
    },
    { label: "Settings", href: "/dashboard/settings" },
    {
      label: "Other",
      href: "",
      subItems: [
        { label: "Back to Website", href: "/" },
        { label: "Logout", href: "/api/auth/logout" },
      ],
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100dvh)]">
      {/* Sidebar */}
      <div className="sticky top-0 md:fixed md:inset-y-0 md:left-0 md:w-64 md:h-full z-10 bg-neutral-900 text-white">
        <div className="flex flex-row items-center p-4">
          <div className="md:hidden mr-4 md:mr-0">
            <button
              onClick={() => setStackOpen(!stackOpen)}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1 md:space-y-2 p-2 lg:p-4">
            <h1 className="text-2xl font-bold text-white">PAVARIT W.</h1>
            <hr className="border-2 border-suzuha-teal-500" />
            <h1 className="text-lg font-extralight">Dashboard</h1>
          </div>
        </div>
        <nav className="hidden md:flex flex-col gap-2 p-4">
          {navItems.map((item, index) => (
            <NavbarVerticalItem
              key={index}
              item={item}
              onClickOutside={() => setStackOpen(false)}
            />
          ))}
        </nav>

        <div ref={ref} className="md:hidden max-w-4xl mx-auto bg-neutral-950">
          <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
            <div className="flex flex-col justify-center items-center space-y-2 p-4">
              {navItems.map((item, index) => (
                <NavbarVerticalItem key={index} item={item} />
              ))}
            </div>
          </CollapsibleContainer>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
