"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

import { FaUser } from "react-icons/fa";

import { useClickOutside } from "@/hooks/useClickOutside";

import FadeInOutContainer from "@/components/container/FadeInOutContainer";

function UserButton() {
  const ref = useRef<HTMLDivElement>(null);

  const { user, isLoading } = useUser();
  const loggedIn = user && !isLoading;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(ref, () => {
    setDropdownOpen(false);
  });

  const dropdownItems = [
    { label: "Profile", href: "/profile" },
    { label: "Logout", href: "/api/auth/logout" },
  ];

  return (
    <div
      ref={ref}
      className="relative flex flex-row items-center cursor-pointer"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      {loggedIn ? (
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full 
          bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {user.picture ? (
            <img
              src={user.picture}
              width={40}
              height={40}
              className="rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <FaUser className="w-4 h-4" />
          )}
        </div>
      ) : (
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full 
          bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FaUser className="w-4 h-4" />
        </div>
      )}

      <FadeInOutContainer visible={dropdownOpen}>
        <div className="absolute top-[115%] right-0 shadow-xl">
          <div className="flex flex-col justify-center items-center min-w-[12rem] rounded-xl bg-gray-100 overflow-hidden">
            {loggedIn && (
              <div className="flex flex-row items-center justify-center space-x-4 p-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="user-picture"
                      width={40}
                      height={40}
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FaUser className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-sm font-bold">
                    {user?.nickname || "no name"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email || "no email"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center w-full">
              {loggedIn ? (
                dropdownItems.map((item, index) => {
                  return (
                    <Link key={index} href={`${item.href}`}>
                      <div
                        className="px-4 py-2 transition-colors text-center 
                        bg-gray-100 hover:bg-gray-200"
                      >
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <Link href="/api/auth/login?prompt=login">
                  <div
                    className="px-4 py-2 transition-colors text-center 
                    bg-gray-100 hover:bg-gray-200"
                  >
                    <span className="text-sm font-bold">Click to login</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </FadeInOutContainer>
    </div>
  );
}

export default UserButton;
