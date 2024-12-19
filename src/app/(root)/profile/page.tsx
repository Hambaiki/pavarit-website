"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import UserInfo from "@/components/profile/UserInfo";

import Loading from "@/components/navigation/Loading";
import Button from "@/components/Button";
import { FaWaveSquare, FaWrench } from "react-icons/fa6";

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
            <h2 className="text-2xl font-bold">Administrator Menu</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col space-y-8 p-4 bg-neutral-900 rounded-xl">
                <div className="flex-1 flex flex-col space-y-2">
                  <h2 className="text-2xl font-semibold">CMS Access</h2>
                  <p className="text-neutral-300">
                    Access the CMS to manage posts and categories.
                  </p>
                </div>

                <Button
                  href={"/dashboard/posts"}
                  className="w-full h-12 rounded-lg"
                  variant="secondary"
                >
                  Start
                </Button>
              </div>

              <div className="flex flex-col space-y-8 p-4 bg-neutral-900 rounded-xl">
                <div className="flex-1 flex flex-col space-y-2">
                  <h2 className="text-2xl font-semibold">Website Settings</h2>
                  <p className="text-neutral-300">Manage website settings.</p>
                </div>

                <Button
                  href={"/dashboard/settings"}
                  className="w-full h-12 rounded-lg"
                  variant="secondary"
                >
                  View settings
                </Button>
              </div>

              <div className="flex flex-col space-y-8 p-4 bg-neutral-900 rounded-xl">
                <div className="flex-1 flex flex-col space-y-2">
                  <h2 className="text-2xl font-semibold">Go to Dashboard</h2>
                  <p className="text-neutral-300">
                    View the dashboard to manage the website.
                  </p>
                </div>

                <Button
                  href={"/dashboard"}
                  className="w-full h-12 rounded-lg"
                  variant="secondary"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {/* <h2 className="text-2xl font-bold">User Info</h2> */}
          <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-neutral-900 rounded-xl min-h-[30rem]">
            <FaWrench className="text-suzuha-teal-500 w-12 h-12" />
            <p className="text-neutral-300 text-center">
              Nothing to see here yet!
            </p>
          </div>
        </div>

        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold">User Info</h2>
          <pre
            className="p-4 mt-4 rounded-xl whitespace-pre-wrap break-all
          text-neutral-300 bg-neutral-900"
          >
            {JSON.stringify(user, null, 2)}
          </pre>
        </div> */}

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
