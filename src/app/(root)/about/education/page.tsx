import Image from "next/image";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import { education } from "@/constants/about";

function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Education", href: "/about/education" },
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
              <p>Learn more about my education journey</p>
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2>Institues That I Have Studied In</h2>

        <p className="mt-4">
          {`My academic path has been shaped by experiences across various institutions, 
            each contributing to my growth and knowledge, each step of my educational journey has shaped who I am today`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {education.map((educationLevel, index) => (
            <div key={index} className="p-4 space-y-4 bg-gray-850 rounded-xl">
              <h3>{educationLevel.level}</h3>

              {educationLevel.educations.map((education, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div>
                    <h4>{education.title}</h4>
                  </div>

                  <div className="flex flex-row items-center space-x-4 p-2 bg-gray-800 rounded-lg">
                    {education.image && (
                      <Image
                        src={education.image}
                        alt={education.location}
                        width={100}
                        height={100}
                        className="w-12 h-12 p-1 shrink-0 bg-gray-600 rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <p>{education.location}</p>
                      <p>{education.duration}</p>
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

export default page;
