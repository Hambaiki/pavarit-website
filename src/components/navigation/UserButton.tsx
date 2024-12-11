"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

import { FaUser } from "react-icons/fa";
import { useState } from "react";
import FadeInOutContainer from "../container/FadeInOutContainer";

function UserButton() {
  const { user, isLoading } = useUser();
  const loggedIn = user && !isLoading;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownItems = [
    { label: "Profile", href: "/profile" },
    { label: "Logout", href: "/api/auth/logout" },
  ];

  return (
    <div
      className="relative flex flex-row items-center"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      {loggedIn ? (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-neutral-950 transition-colors">
          {user.picture ? (
            <img
              src={user.picture}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <FaUser className="w-4 h-4" />
          )}
        </div>
      ) : (
        <Link href="/api/auth/login">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-neutral-950 transition-colors">
            <FaUser className="w-4 h-4" />
          </div>
        </Link>
      )}

      <FadeInOutContainer visible={dropdownOpen}>
        <div className="absolute top-[115%] right-0 shadow-xl">
          <div className="flex flex-col justify-center items-center rounded-xl bg-black overflow-hidden">
            <div className="flex flex-row items-center justify-center space-x-4 p-4">
              {loggedIn && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-neutral-950 transition-colors">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="user-picture"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUser className="w-4 h-4" />
                  )}
                </div>
              )}

              {loggedIn ? (
                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-sm font-bold">
                    {user?.nickname || "no name"}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {user?.email || "no email"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-32">
                  <span className="text-sm font-bold">Click to login</span>
                </div>
              )}
            </div>

            {loggedIn && (
              <div className="flex flex-col justify-center w-full">
                {dropdownItems.map((item, index) => {
                  return (
                    <Link key={index} href={`${item.href}`}>
                      <div
                        className="px-4 py-2 transition-colors text-center 
                      bg-black hover:bg-neutral-950"
                      >
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </FadeInOutContainer>
    </div>
  );
}

export default UserButton;
