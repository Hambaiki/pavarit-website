"use client";

import { useTheme } from "next-themes";
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa6";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // if (!mounted)
  //   return <button disabled className="p-2 h-10 w-auto rounded-full" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 h-10 w-auto rounded-full hover:bg-gray-800 transition-colors"
    >
      {theme === "dark" ? (
        <FaSun className="w-5 h-5 text-gray-100" suppressHydrationWarning />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-100" suppressHydrationWarning />
      )}
    </button>
  );
}
