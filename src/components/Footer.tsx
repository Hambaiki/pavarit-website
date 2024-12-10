import { contactItems, navItems } from "@/constants/common";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <div className="w-full bg-neutral-900 shadow-xl">
      <div className="flex flex-col md:flex-row max-w-5xl w-full mx-auto p-4 md:p-8 space-y-4 space-x-0 md:space-y-0 md:space-x-8">
        <div className="flex-1 space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <Image
              src="/images/logo/pw/pw-light.svg"
              alt="PAVARIT W."
              width={100}
              height={100}
              className="w-10 h-10"
            />
            <h2 className="text-lg font-semibold text-neutral-300">
              PAVARIT W.
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          <h3 className="text-sm font-semibold text-neutral-300">Links</h3>
          <ul className="grid grid-cols-1 gap-2 list-inside list-disc">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-sm text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          <h3 className="text-sm font-semibold text-neutral-300">Contact</h3>
          <ul className="grid grid-cols-1 gap-2 list-inside list-disc">
            {contactItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-sm text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
