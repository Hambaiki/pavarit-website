"use client";

import CmsAccess from "@/components/post/cms/CmsAccess";
import { checkCMSAuthorized } from "@/app/action";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession } from "@auth0/nextjs-auth0";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import UserInfo from "@/components/profile/UserInfo";

import Loading from "@/components/navigation/Loading";
import Button from "@/components/Button";

function Profile() {
  const { user, isLoading } = useUser();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  const roles = user?.["http://localhost:3000/roles"] as string[];
  const isAdmin = roles?.includes("admin");

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col mt-8">
        <UserInfo
          name={user?.name || ""}
          picture={user?.picture || ""}
          email={user?.email || ""}
          emailVerified={user?.email_verified || false}
        />

        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold">
              Welcome, Administrator {user?.name}!
            </h2>

            <div className="mt-4">
              <div className="flex flex-col space-y-4 p-4 bg-neutral-900 rounded-xl ">
                <div className="flex-1 flex flex-col space-y-2">
                  <h2 className="text-2xl font-semibold">CMS Access</h2>
                  <p className="text-neutral-300">
                    Access the CMS to manage posts and categories.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    href={"/cms/posts"}
                    className="w-full max-w-xs h-12 rounded-lg"
                    variant="secondary"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold">User Info</h2>
          <pre
            className="p-4 mt-4 rounded-xl whitespace-pre-wrap break-all
          text-neutral-300 bg-neutral-900"
          >
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold">Decoded Access Token</h2>
          <pre
            className="p-4 mt-4 rounded-xl whitespace-pre-wrap break-all
          text-neutral-300 bg-neutral-900"
          >
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </div> */}
      </div>

      {/* <div id="about" className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-neutral-300 mt-2">
          {`With a keen interest technologies, I've spent the past few years
          exploring the development of web applications with technologies such
          as ReactJS, NextJS, TypeScript, AWS, etc. As for my work
          methodologies, I thrive in the dynamic environment of Agile
          methodologies as I can adapt swiftly to changes and collaborating
          effectively within cross-functional teams.`}
        </p>
      </div> */}

      {/* <div className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">Contents</h2>
        <ul className="mt-4 space-y-2">
          {tableOfContents.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div> */}
    </MainContainer>
  );
}

export default Profile;
