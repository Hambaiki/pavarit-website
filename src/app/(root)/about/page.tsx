import Image from "next/image";
import { Metadata } from "next";

import { education, experiences } from "@/constants/about";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

function About() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col space-y-4 mt-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 space-x-0 sm:space-x-8 sm:space-y-0">
          <Image
            src="/images/profile/pavarit.jpg"
            alt="About"
            width={500}
            height={500}
            className="w-48 h-48 object-cover rounded-full"
          />
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold">
              Pavarit (Guide) Wiriyakunakorn
            </h1>
            <p className="text-neutral-300">
              I am a frontend developer. I am passionate about technology and
              programming.
            </p>
          </div>
        </div>
      </div>

      <div id="about" className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-neutral-300 mt-2">
          {`With a keen interest technologies, I've spent the past few years
          exploring the development of web applications with technologies such
          as ReactJS, NextJS, TypeScript, AWS, etc. As for my work
          methodologies, I thrive in the dynamic environment of Agile
          methodologies as I can adapt swiftly to changes and collaborating
          effectively within cross-functional teams.`}
        </p>
      </div>

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

      <div id="experience" className="mt-8  rounded-xl">
        <h2 className="text-2xl font-bold">Work Experience</h2>

        <div className="flex-1 flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900 pb-4 mt-4">
          {experiences.map((experience, index) => (
            <div key={index} className="flex flex-col ">
              <div className="flex flex-col items-center mr-4">
                <div className="flex flex-col space-y-2 w-[20rem] p-4 rounded-xl bg-black">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{experience.title}</h3>
                    <p className="text-neutral-300">
                      {experience.type}&nbsp;|&nbsp;{experience.duration}
                    </p>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-black rounded-full">
                    {experience.company.logo && (
                      <Image
                        src={experience.company.logo}
                        alt={experience.company.name}
                        width={100}
                        height={100}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="text-neutral-300">
                        {experience.company.name}
                      </p>
                      <p className="text-neutral-500">{experience.location}</p>
                    </div>
                  </div>

                  <p className="text-neutral-300">{experience.description}</p>

                  <div className="flex flex-row flex-wrap items-center gap-2">
                    {experience.skills.map((skill, index) => (
                      <p
                        key={index}
                        className="text-neutral-300 text-sm bg-neutral-800 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </p>
                    ))}
                  </div>

                  {/* {index !== experiences.length - 1 && (
                <div className="w-1 h-12 bg-neutral-700" />
              )} */}
                </div>

                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black rotate-180" />
              </div>

              <div className="flex flex-row items-center mt-2">
                <div
                  className={`h-1 w-[9.45rem] ${
                    index !== 0 ? "bg-suzuha-teal-700" : "bg-transparent"
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full ${
                    index === 0 ? "bg-suzuha-teal-400" : "bg-suzuha-teal-900"
                  }`}
                />
                {index !== experiences.length - 1 && (
                  <div className="flex-1 h-1 bg-suzuha-teal-700" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="education" className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">Education</h2>

        <div className="flex flex-col mt-4 space-y-6">
          {education.map((education, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div>
                <h3 className="text-xl font-bold">{education.title}</h3>
              </div>

              <div className="flex flex-row items-center space-x-4 p-2 bg-black rounded-full">
                {education.image && (
                  <Image
                    src={education.image}
                    alt={education.location}
                    width={100}
                    height={100}
                    className="w-12 h-12 p-1 bg-neutral-800 rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-neutral-300">{education.location}</p>
                  <p className="text-neutral-500">{education.duration}</p>
                </div>
              </div>

              {/* {index !== experiences.length - 1 && (
                <div className="w-1 h-12 bg-neutral-700" />
              )} */}
            </div>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}

export const metadata: Metadata = {
  title: "About Pavarit (Guide) Wiriyakunakorn",
  description: "Learn more about Pavarit",
  keywords: ["Pavarit", "Guide", "Wiriyakunakorn", "Frontend Developer"],
  openGraph: {
    title: "About Pavarit (Guide) Wiriyakunakorn",
    description: "Learn more about Pavarit",
  },
  twitter: {
    title: "About Pavarit (Guide) Wiriyakunakorn",
    description: "Learn more about Pavarit",
  },
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default About;
