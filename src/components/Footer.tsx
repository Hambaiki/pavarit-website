import { contactItems, navItems } from "@/constants/common";
import React from "react";

function Footer() {
  return (
    <div className="w-full bg-neutral-900">
      <div className="flex flex-row max-w-5xl w-full mx-auto p-4 md:p-8 space-x-8">
        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold text-neutral-300">PAVARIT W.</h2>
          {/* <p className="text-sm text-neutral-400">Frontend Developer</p> */}
        </div>

        <div className="flex-1 flex flex-col  space-y-2">
          <h3 className="text-sm font-medium text-neutral-300">Links</h3>
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-neutral-300">Contact</h3>
          <div className="flex flex-col space-y-1">
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
