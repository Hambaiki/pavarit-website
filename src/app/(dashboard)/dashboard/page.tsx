"use client";

import { useState, useEffect } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import UserInfo from "@/components/profile/UserInfo";

import Loading from "@/components/navigation/Loading";
import Button from "@/components/Button";

function Profile() {
  const { user, isLoading } = useUser();

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Profile", href: "/dashboard/profile" },
  ];

  useEffect(() => {
    // Fetch initial maintenance mode status
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => setIsMaintenanceMode(data.maintenanceMode));
  }, []);

  const toggleMaintenanceMode = async () => {
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !isMaintenanceMode }),
      });
      const data = await res.json();
      setIsMaintenanceMode(data.maintenanceMode);
    } catch (error) {
      console.error("Failed to toggle maintenance mode:", error);
    }
  };

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
            <h2 className="text-2xl font-bold">Administrator Controls</h2>

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
                    href={"/dashboard/posts"}
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

        {/* {isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Administrator Controls</h2>

            <div className="mt-4">
              <div className="flex flex-col space-y-4 p-4 bg-neutral-900 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Maintenance Mode</h3>
                    <p className="text-neutral-300">
                      Enable to show maintenance page to all visitors
                    </p>
                  </div>
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isMaintenanceMode
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-suzuha-teal-500 hover:bg-suzuha-teal-600"
                    }`}
                  >
                    {isMaintenanceMode ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

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
