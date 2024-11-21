"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = ["Home", "About", "Projects", "Contact"];

  return (
    <div className="flex flex-col w-full p-4 space-y-4 rounded-2xl bg-neutral-950">
      <h1 className="text-2xl font-bold text-neutral-100">Hambaiki</h1>

      <div
        className="flex justify-center items-center w-full p-2 rounded-lg md:rounded-full
                    bg-gradient-to-b from-neutral-800 to-neutral-900"
      >
        <div className="flex md:flex-row flex-col justify-center items-center gap-4 w-full max-w-xl">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase()}`}
              className={`flex-1 w-full px-4 py-2 rounded-full
                          transition-colors duration-300
                          text-center ${
                            pathname === `/${item.toLowerCase()}`
                              ? "bg-neutral-950"
                              : "hover:bg-neutral-900"
                          }`}
            >
              <span className={`text-neutral-100`}>{item}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
