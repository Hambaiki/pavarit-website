import { getSession } from "@auth0/nextjs-auth0";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import UserInfo from "@/components/profile/UserInfo";

async function Profile() {
  const session = await getSession();
  const sessionUser = session?.user;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col mt-8">
        <UserInfo
          name={sessionUser?.name || ""}
          picture={sessionUser?.picture || ""}
          email={sessionUser?.email || ""}
          emailVerified={sessionUser?.email_verified || false}
        />
        <pre
          className="p-4 mt-8 rounded-xl whitespace-pre-wrap
          text-neutral-300 bg-neutral-900"
        >
          {JSON.stringify(sessionUser, null, 2)}
        </pre>
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
