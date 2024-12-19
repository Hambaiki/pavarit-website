import Image from "next/image";
import { Metadata } from "next";

import { education, experiences, tableOfContents } from "@/constants/about";

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
            className="w-48 h-48 object-cover rounded-full border-4 border-suzuha-teal-500"
          />
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold">Pavarit Wiriyakunakorn</h1>
            <p className="text-neutral-300">
              Frontend Developer | Information and Communication Engineering
              Graduate
            </p>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">Quickly Jumps To:</h2>
        <ul className="flex flex-row flex-wrap gap-2 mt-4">
          {tableOfContents.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full
                text-neutral-300 hover:text-white transition-colors "
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div> */}

      {/* <div id="introduction" className="mt-8 rounded-xl">
        <h2 className="text-2xl font-bold">Introduction</h2>

        <div id="about" className="mt-4 p-4 bg-neutral-900 rounded-xl">
          <h2 className="text-xl font-bold">About Me</h2>
        </div>
      </div> */}

      <div id="experience" className="mt-8 rounded-xl">
        <h2 className="text-2xl font-bold">Work Experience</h2>

        <div id="about" className="mt-4 p-4 bg-neutral-900 rounded-xl">
          <h2 className="text-xl font-bold">My Journey</h2>

          <p className="text-neutral-300 mt-2">
            Throughout my journey, I have gained hands-on experience in both
            professional and academic settings, contributing to my growth as a
            Frontend Developer and beyond. I am currently working as a Junior
            Frontend Developer at Agnos Health Co., Ltd., where I focus on
            developing and maintaining modern web applications using tools like
            ReactJS, NextJS, and TypeScript.
          </p>
        </div>

        <div className="flex-1 flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900 pb-4 mt-4">
          {experiences.map((experience, index) => (
            <div key={index} className="flex flex-col ">
              <div className="flex flex-col items-center mr-4">
                <div className="flex flex-col space-y-2 w-[20rem] p-4 rounded-xl bg-neutral-950">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{experience.title}</h3>
                    <p className="text-neutral-300">
                      {experience.type}&nbsp;|&nbsp;{experience.duration}
                    </p>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-neutral-900 rounded-lg">
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

        <div id="about" className="mt-4 p-4 bg-neutral-900 rounded-xl">
          {/* <h2 className="text-xl font-bold">My Journey</h2> */}
          <p className="text-neutral-300">
            Previously, I honed my technical and teamwork skills as a Frontend
            Developer Intern at the same company, handling key projects and
            gaining expertise in Web application development. My passion for
            technology and communication led me to serve as a Teaching Assistant
            for Chulalongkorn University, where I supported students in
            mastering Principles of Telecommunication, including concepts like
            networking and encryption.
          </p>

          <p className="text-neutral-300 mt-4">
            These diverse experiences have strengthened my technical abilities,
            problem-solving mindset, and collaborative approach, allowing me
            to take on challenging projects and deliver results.
          </p>
        </div>
      </div>

      <div id="education" className="mt-8">
        <h2 className="text-2xl font-bold">Education</h2>

        <div id="about" className="mt-4 p-4 bg-neutral-900 rounded-xl">
          <h2 className="text-xl font-bold">Summary</h2>

          <p className="text-neutral-300 mt-2">
            {`My academic path has been shaped by experiences across various institutions, 
            each contributing to my growth and knowledge, each step of my educational journey has shaped who I am today`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {education.map((educationLevel, index) => (
            <div
              key={index}
              className="p-4 space-y-4 bg-neutral-950 rounded-xl"
            >
              <h3 className="text-xl font-bold">{educationLevel.level}</h3>

              {educationLevel.educations.map((education, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div>
                    <h3 className="text-base font-semibold">
                      {education.title}
                    </h3>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-neutral-900 rounded-lg">
                    {education.image && (
                      <Image
                        src={education.image}
                        alt={education.location}
                        width={100}
                        height={100}
                        className="w-12 h-12 p-1 shrink-0 bg-neutral-600 rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm text-neutral-300">
                        {education.location}
                      </p>
                      <p className="text-neutral-500">{education.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}

export const metadata: Metadata = {
  title: "About Pavarit (Guide) Wiriyakunakorn's. Learn more about me.",
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
    title: "About Pavarit (Guide) Wiriyakunakorn",
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
