import { Metadata } from "next";

import { FaImages, FaMagnifyingGlass } from "react-icons/fa6";

import { aboutItems } from "@/constants/about";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PhotosCarousal from "@/components/about/PhotosCarousal";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";

function About() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  const featuredImages = [
    {
      src: "/assets/images/photos/pavarit.jpg",
      alt: "Me in my graduation day",
      description:
        "This is the photo of me in my graduation day after receiving my Bachelor's degree in Information and Communication Engineering from Chulalongkorn University.",
    },
    {
      src: "/assets/images/photos/friends-at-maneki.jpg",
      alt: "Me and my friends at Manekineko, a karaoke in Bangkok",
      description:
        "Me and my friends at Manekineko, a karaoke in Bangkok. I'm the one in the middle-left! Occasionaly, I go to karaoke with my friends.",
    },
  ];

  return (
    <MainContainer className="space-y-10">
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="flex flex-col space-y-4 mt-8">
          <h1>About Me</h1>
          <p>
            {`I'm Pavarit Wiriyakunakorn, a frontend developer with a passion for creating web applications.
            I'm a graduate of Information and Communication Engineering from Chulalongkorn University. Currently, I'm working as a frontend developer at a startup company.`}
          </p>
        </div>
      </header>

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <FaImages className="h-6 w-6 text-suzuha-teal-500" />
          <h2>Featured Photos</h2>
        </div>

        <PhotosCarousal images={featuredImages} />
      </section>

      {/* <div className="mt-8 p-4 bg-gray-850 rounded-xl">
        <h2>Quickly Jumps To:</h2>
        <ul className="flex flex-row flex-wrap gap-2 mt-4">
          {tableOfContents.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full
                text-gray-300 hover:text-white transition-colors "
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div> */}

      <section>
        <div className="flex items-center space-x-2">
          <FaMagnifyingGlass className="h-6 w-6 text-suzuha-teal-500" />
          <h2>Learn More About Me</h2>
        </div>
        <p className="mt-4">
          {`I have devided information about me into these sections. You can
          start learning more about me by clicking on the links below.`}
        </p>

        <OptionMenuGrid items={aboutItems} />
      </section>
    </MainContainer>
  );
}

export const metadata: Metadata = {
  title: "About Pavarit Wiriyakunakorn - Pavarit's Website",
  description:
    "Learn more about Pavarit Wiriyakunakorn, a frontend developer with a passion for creating web applications.",
  keywords: [
    "Pavarit",
    "Guide",
    "Wiriyakunakorn",
    "Frontend Developer",
    "Information and Communication Engineering",
    "Chulalongkorn University",
    "Triam Udom Suksa Phatthanakarn School",
    "Panaya Phatthanakarn School",
    "Panaya Phatthanakarn Bilingual School",
    "Portfolio",
    "Profile",
    "About",
    "Thailand",
    "Bangkok",
  ],
  openGraph: {
    title: "About Pavarit (Guide) Wiriyakunakorn - Pavarit's Website",
    description: "Learn more about Pavarit",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default About;
