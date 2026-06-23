import Link from "next/link";

import { contactItems } from "@/constants/common";
import { navItems } from "@/constants/navigation";

function Footer() {
  return (
    <div className="w-full">
      <div
        className="flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 py-6 md:p-8 md:py-10
          gap-8"
      >
        <div className="flex flex-col gap-6 justify-between items-center md:items-start">
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <p className="font-bold text-lg text-gray-700">
              Developed by Pavarit W.
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, Tailwind CSS, Vercel, and Neon.
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-3 justify-center">
            {contactItems
              .filter((item) => item.value)
              .map((item, index) => (
                <a
                  key={index}
                  href={item.value}
                  target="_blank"
                  className="group flex flex-row items-center justify-center
                      w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <item.icon className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                </a>
              ))}
          </div>
        </div>

        <nav className="hidden md:flex flex-row flex-wrap gap-6 md:gap-10 justify-center md:justify-end flex-1 text-sm">
          {/* Pages without subItems grouped into one column */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700 mb-1">Pages</p>
            {navItems
              .filter((item) => !item.subItems || item.subItems.length === 0)
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Items with subItems each get their own column */}
          {navItems
            .filter((item) => item.subItems && item.subItems.length > 0)
            .map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <Link
                  href={item.href}
                  className="font-semibold text-sm text-gray-700 hover:text-primary-500 transition-colors mb-1"
                >
                  {item.label}
                </Link>
                <ul className="flex flex-col gap-1.5">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={subItem.href}
                        className="text-gray-500 hover:text-primary-500 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
}

export default Footer;
