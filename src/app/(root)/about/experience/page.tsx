import Image from "next/image";

import { experiences } from "@/constants/about";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Work Experience", href: "/about/experience" },
  ];

  return (
    <MainContainer className="space-y-10">
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="flex flex-col space-y-4 mt-8 p-4 md:p-8 bg-gray-850 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center space-y-4 space-x-0 sm:space-x-8 sm:space-y-0">
            <Image
              src="/images/profile/pavarit.jpg"
              alt="About"
              width={500}
              height={500}
              className="w-48 h-48 object-cover rounded-full border-4 border-suzuha-teal-500"
            />
            <div className="flex flex-col space-y-4">
              <h1>Pavarit Wiriyakunakorn</h1>
              <p>
                Frontend Developer | Information and Communication Engineering
                Graduate
              </p>
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2>Work Experience</h2>

        <p className="mt-4">
          Throughout my journey, I have gained hands-on experience in both
          professional and academic settings, contributing to my growth as a
          Frontend Developer and beyond. I am currently working as a Junior
          Frontend Developer at Agnos Health Co., Ltd., where I focus on
          developing and maintaining modern web applications using tools like
          ReactJS, NextJS, and TypeScript.
        </p>

        <div className="flex-1 flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-850 pb-4 mt-8">
          {experiences.map((experience, index) => (
            <div key={index} className="flex flex-col ">
              <div className="flex flex-col items-center mr-4">
                <div className="flex flex-col space-y-2 w-[20rem] p-4 rounded-xl bg-gray-850">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{experience.title}</h3>
                    <p>
                      {experience.type}&nbsp;|&nbsp;{experience.duration}
                    </p>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-gray-800 rounded-lg">
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
                      <p>{experience.company.name}</p>
                      <p>{experience.location}</p>
                    </div>
                  </div>

                  <p>{experience.description}</p>

                  <div className="flex flex-row flex-wrap items-center gap-2">
                    {experience.skills.map((skill, index) => (
                      <p
                        key={index}
                        className="text-sm bg-gray-800 text-white px-3 py-1 rounded-full"
                      >
                        {skill}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-850 rotate-180" />
              </div>

              <div className="flex flex-row items-center mt-2">
                <div
                  className={`h-1 w-[9.45rem] ${
                    index !== 0 ? "bg-suzuha-teal-700" : "bg-transparent"
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full ${
                    index === 0 ? "bg-suzuha-teal-500" : "bg-suzuha-teal-800"
                  }`}
                />
                {index !== experiences.length - 1 && (
                  <div className="flex-1 h-1 bg-suzuha-teal-700" />
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8">
          Previously, I honed my technical and teamwork skills as a Frontend
          Developer Intern at the same company, handling key projects and
          gaining expertise in Web application development. My passion for
          technology and communication led me to serve as a Teaching Assistant
          for Chulalongkorn University, where I supported students in mastering
          Principles of Telecommunication, including concepts like networking
          and encryption.
        </p>

        <p className="mt-4">
          These diverse experiences have strengthened my technical abilities,
          problem-solving mindset, and collaborative approach, allowing me to
          take on challenging projects and deliver results.
        </p>
      </section>
    </MainContainer>
  );
}

export default page;
