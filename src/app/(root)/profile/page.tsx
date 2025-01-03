"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

import { FaWrench } from "react-icons/fa6";

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
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="flex flex-col space-y-4 mt-8">
          <UserInfo
            name={user?.name || ""}
            picture={user?.picture || ""}
            email={user?.email || ""}
            emailVerified={user?.email_verified || false}
          />
        </div>
      </header>

      {isAdmin && (
        <section className="mt-8">
          <h2>Administrator Menu</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col space-y-8 p-4 bg-neutral-900 rounded-xl">
              <div className="flex-1 flex flex-col space-y-2">
                <h3>CMS Access</h3>
                <p>Access the CMS to manage posts and categories.</p>
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
                <h3>Website Settings</h3>
                <p>Manage website settings.</p>
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
                <h3>Go to Dashboard</h3>
                <p>View the dashboard to manage the website.</p>
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
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-neutral-900 rounded-xl min-h-[30rem]">
          <FaWrench className="text-suzuha-teal-500 w-12 h-12" />
          <p className="text-neutral-300 text-center">
            Nothing to see here yet!
          </p>
        </div>
      </section>
    </MainContainer>
  );
}

// export async function generateMetadata() {
//   return {
//     title: "Profile - Pavarit's Website",
//     description: "View your profile on Pavarit's Website.",
//     keywords: ["Profile", "Pavarit", "Wiriyakunakorn"],
//     robots: "index, follow",
//     alternates: {
//       canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
//     },
//   };
// }

export default Profile;
