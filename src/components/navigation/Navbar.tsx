"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { FaBars, FaUser } from "react-icons/fa6";

import { navItems } from "@/constants/common";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import NavbarItem from "./NavbarItem";
import Button from "../Button";
import UserButton from "./UserButton";
import NavbarVerticalItem from "./NavbarVerticalItem";

export default function Navbar() {
  const pathname = usePathname();

  const [stackOpen, setStackOpen] = useState(false);

  useEffect(() => {
    setStackOpen(false);
  }, [pathname]);

  return (
    <div className="w-full bg-neutral-900 shadow-xl border-b border-primary-gray-border">
      <div className="flex flex-row items-start justify-between max-w-5xl mx-auto p-6 md:p-8 space-x-8">
        <div className="flex flex-row items-center">
          <div className="md:hidden mr-4 md:mr-0">
            <button
              onClick={() => setStackOpen(!stackOpen)}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-primary-gray-border transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl font-bold text-white">PAVARIT W.</h1>
            <hr className="border-2 border-suzuha-teal-500" />
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <nav className="hidden md:flex flex-row justify-end items-center space-x-2">
            {navItems.map((item, index) => (
              <NavbarItem key={index} item={item} />
            ))}
          </nav>

          <UserButton />
        </div>
      </div>

      <div className="md:hidden max-w-4xl mx-auto bg-neutral-950">
        <CollapsibleContainer startCollapsed collapsed={!stackOpen}>
          <div className="flex flex-col justify-center items-center space-y-2 p-6">
            {navItems.map((item, index) => (
              <NavbarVerticalItem key={index} item={item} />
            ))}
          </div>
        </CollapsibleContainer>
      </div>
    </div>
  );
}
