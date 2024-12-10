import Image from "next/image";

import { experiences } from "@/constants/about";

import MainContainer from "@/components/container/MainContainer";

function About() {
  return (
    <MainContainer>
      <div className="flex flex-col space-y-4 mt-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 space-x-0 sm:space-x-8 sm:space-y-0">
          <Image
            src="/images/placeholder/placeholder-image.jpg"
            alt="About"
            width={100}
            height={100}
            className="w-36 h-36 object-cover rounded-full"
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

      <div className="mt-8 p-4 bg-neutral-900 rounded-xl">
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

      <div className="mt-8 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">Experience</h2>

        <div className="flex flex-col mt-4 space-y-6">
          {experiences.map((experience, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div>
                <h3 className="text-xl font-bold">{experience.title}</h3>
                <p className="text-neutral-300">{experience.type}</p>
              </div>

              <div className="flex flex-row items-center space-x-2">
                {experience.company.logo && (
                  <Image
                    src={experience.company.logo}
                    alt={experience.company.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                )}
                <p className="text-neutral-300">{experience.company.name}</p>
              </div>
              <p className="text-neutral-300">{experience.description}</p>
              <p className="text-neutral-300">{experience.duration}</p>
              <p className="text-neutral-300">{experience.location}</p>

              <div className="flex flex-row flex-wrap items-center gap-2">
                {experience.skills.map((skill, index) => (
                  <p
                    key={index}
                    className="text-neutral-300 text-sm bg-black px-3 py-1 rounded-full"
                  >
                    {skill}
                  </p>
                ))}
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

export default About;
