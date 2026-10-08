import Image from "next/image";
import { Metadata } from "next";

import {
  FaBriefcase,
  FaGraduationCap,
  FaImages,
  FaMagnifyingGlass,
  FaPlane,
} from "react-icons/fa6";

import {
  featuredImages,
  trainingImages,
  aboutItems,
  education,
  experiences,
} from "@/constants/about";

import MainContainer from "@/components/container/MainContainer";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";
import MainHeader from "@/components/common/MainHeader";

function About() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <MainContainer className="space-y-10">
      <MainHeader
        title="About Me"
        description={`I'm Pavarit Wiriyakunakorn, a frontend developer with a passion for creating web applications.
            I'm a graduate of Information and Communication Engineering from Chulalongkorn University. I currently work as a frontend developer and am also training as a student pilot pursuing CPL/IR integrated with ATP theory.`}
        breadcrumbs={breadcrumbs}
      />

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <FaImages className="h-6 w-6 text-accent" />
          <h2>Featured Photos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredImages.map((image, index) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1000}
                height={1000}
                sizes="(max-width: 640px) 100vw, 50vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="space-y-2 p-4">
                <h3 className="text-xl font-semibold">{image.alt}</h3>
                <p>{image.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="about">
        <div className="flex items-center space-x-2">
          <FaMagnifyingGlass className="h-6 w-6 text-accent" />
          <h2>Learn More About Me</h2>
        </div>
        <p className="mt-4">
          {`My story, experience, and education are all brought together here in one place. Use the links below to jump directly to the sections that interest you.`}
        </p>

        <OptionMenuGrid items={aboutItems} />
      </section>

      <section id="experience" className="space-y-4">
        <div className="flex items-center space-x-2">
          <FaBriefcase className="h-6 w-6 text-accent" />
          <h2>Work Experience</h2>
        </div>

        <p>
          Throughout my journey, I have gained hands-on experience in both
          professional and academic settings, contributing to my growth as a
          Frontend Developer and beyond. I am currently working as a Junior
          Frontend Developer at Agnos Health Co., Ltd., where I focus on
          developing and maintaining modern web applications using tools like
          ReactJS, NextJS, and TypeScript.
        </p>

        <div className="mt-8">
          {experiences.map((experience, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex w-5 flex-col items-center">
                <div
                  className={`w-1 flex-1 ${
                    index === 0 ? "bg-transparent" : "bg-accent-strong"
                  }`}
                />
                <div
                  className={`w-5 h-5 rounded-full ${
                    index === 0 ? "bg-accent" : "bg-accent-deep"
                  }`}
                />
                <div
                  className={`w-1 flex-1 ${
                    index === experiences.length - 1
                      ? "bg-transparent"
                      : "bg-accent-strong"
                  }`}
                />
              </div>

              <div className="flex-1 p-4 rounded-xl bg-surface">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{experience.title}</h3>
                  <p>
                    {experience.type}&nbsp;|&nbsp;{experience.duration}
                  </p>
                </div>

                <div className="mt-4 flex flex-row items-center space-x-4 p-2 bg-surface-raised rounded-lg">
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

                <p className="mt-4">{experience.description}</p>

                <div className="mt-4 flex flex-row flex-wrap items-center gap-2">
                  {experience.skills.map((skill, skillIndex) => (
                    <p
                      key={skillIndex}
                      className="text-sm bg-surface-raised text-content-secondary px-3 py-1 rounded-full"
                    >
                      {skill}
                    </p>
                  ))}
                </div>
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

      <section id="training" className="space-y-4">
        <div className="flex items-center space-x-2">
          <FaPlane className="h-6 w-6 text-accent" />
          <h2>Pilot Training</h2>
        </div>

        <p>
          I am currently a student pilot pursuing a CPL/IR integrated training
          path, with ATP theory as part of my aviation studies. This next
          chapter reflects my long-term ambition in aviation and my commitment
          to building the discipline, technical understanding, and flight skills
          required to fly professionally.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {trainingImages.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1000}
                height={1000}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="space-y-2 p-4">
                <h3 className="text-lg font-semibold">{image.alt}</h3>
                <p>{image.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="education" className="space-y-4">
        <div className="flex items-center space-x-2">
          <FaGraduationCap className="h-6 w-6 text-accent" />
          <h2>Education</h2>
        </div>

        <p>
          My academic path has been shaped by experiences across various
          institutions, each contributing to my growth and knowledge. Every step
          of my educational journey has shaped who I am today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {education.map((educationLevel, index) => (
            <div key={index} className="p-4 space-y-4 bg-surface rounded-xl">
              <h3>{educationLevel.level}</h3>

              {educationLevel.educations.map((educationItem, itemIndex) => (
                <div key={itemIndex} className="flex flex-col space-y-2">
                  <div>
                    <h4>{educationItem.title}</h4>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-surface-raised rounded-lg">
                    {educationItem.image && (
                      <Image
                        src={educationItem.image}
                        alt={educationItem.location}
                        width={100}
                        height={100}
                        className="w-12 h-12 p-1 shrink-0 bg-surface-muted rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <p>{educationItem.location}</p>
                      <p>{educationItem.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
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
    canonical: "/about",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default About;
