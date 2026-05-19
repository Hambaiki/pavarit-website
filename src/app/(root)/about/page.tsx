import { Metadata } from "next";

import { FaImages, FaMagnifyingGlass } from "react-icons/fa6";

import EducationGrid from "@/components/about/EducationGrid";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import PhotosGallery from "@/components/about/PhotosGallery";
import MainHeader from "@/components/common/MainHeader";
import MainContainer from "@/components/container/MainContainer";
import { education, experiences, featuredImages } from "@/constants/about";

function About() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <MainContainer className="space-y-10">
      <section id="about">
        <MainHeader
          title="About Me"
          description={`I'm Pavarit Wiriyakunakorn, a frontend developer with a passion for creating web applications.
            I'm a graduate of Information and Communication Engineering from Chulalongkorn University. Currently, I'm working as a frontend developer at a startup company.`}
          breadcrumbs={breadcrumbs}
        />
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-10">
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <FaImages className="h-6 w-6 text-primary-500" />
              <h2>Featured Photos</h2>
            </div>

            <PhotosGallery images={featuredImages} />
          </section>

          <section id="experience">
            <div className="flex items-center space-x-2">
              <FaMagnifyingGlass className="h-6 w-6 text-primary-500" />
              <h2>Work Experience</h2>
            </div>
            <p className="mt-4">
              Throughout my journey, I have gained hands-on experience in both
              professional and academic settings, contributing to my growth as a
              Frontend Developer and beyond. I am currently working as a Junior
              Frontend Developer at Agnos Health Co., Ltd., where I focus on
              developing and maintaining modern web applications using tools
              like ReactJS, NextJS, and TypeScript.
            </p>

            <ExperienceTimeline items={experiences} />

            <p className="mt-8">
              Previously, I honed my technical and teamwork skills as a Frontend
              Developer Intern at the same company, handling key projects and
              gaining expertise in Web application development. My passion for
              technology and communication led me to serve as a Teaching
              Assistant for Chulalongkorn University, where I supported students
              in mastering Principles of Telecommunication, including concepts
              like networking and encryption.
            </p>

            <p className="mt-4">
              These diverse experiences have strengthened my technical
              abilities, problem-solving mindset, and collaborative approach,
              allowing me to take on challenging projects and deliver results.
            </p>
          </section>

          <section id="education">
            <div className="flex items-center space-x-2">
              <FaMagnifyingGlass className="h-6 w-6 text-primary-500" />
              <h2>Institues That I Have Studied In</h2>
            </div>

            <p className="mt-4">
              {`My academic path has been shaped by experiences across various institutions,
            each contributing to my growth and knowledge, each step of my educational journey has shaped who I am today`}
            </p>

            <EducationGrid items={education} />
          </section>
        </div>
      </div>
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
