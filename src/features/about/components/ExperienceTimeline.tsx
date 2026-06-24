import Image from "next/image";

import { cn } from "@/lib/cn";

interface ExperienceItem {
  title: string;
  type: string;
  company: {
    name: string;
    logo?: string;
  };
  description: string;
  duration: string;
  location: string;
  skills: string[];
  images?: string[];
}

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="flex flex-col mt-8">
      {items.map((experience, index) => (
        <div key={index} className="flex flex-row">
          <div className="flex flex-col items-center mr-4">
            <div
              className={`w-1 flex-1 ${
                index !== 0 ? "bg-gray-300" : "bg-transparent"
              }`}
            />
            <div
              className={`w-5 h-5 rounded-full shrink-0 ${
                index === 0 ? "bg-primary-500" : "bg-primary-500/50"
              }`}
            />
            <div
              className={`w-1 flex-1 ${
                index !== items.length - 1 ? "bg-gray-300" : "bg-transparent"
              }`}
            />
          </div>

          <div className="flex-1 flex flex-col pb-6">
            <div className="flex flex-col space-y-2 card p-4 rounded-xl -mt-0.5">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{experience.title}</h3>
                <p>
                  {experience.type}&nbsp;|&nbsp;{experience.duration}
                </p>
              </div>

              <div className="flex flex-row items-center space-x-4 p-2 bg-form-option-active rounded-lg">
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

              {experience.images &&
                experience.images.length > 0 &&
                (() => {
                  const images = experience.images;
                  const isSingle = images.length === 1;
                  return (
                    <div
                      className={cn("grid gap-2", {
                        "grid-cols-1": isSingle,
                        "grid-cols-2": !isSingle,
                      })}
                    >
                      {images.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={cn(
                            "relative w-full h-48 rounded-lg overflow-hidden",
                            {
                              "max-w-sm mx-auto": isSingle,
                            }
                          )}
                        >
                          <Image
                            src={image}
                            alt={`${experience.title} ${imageIndex + 1}`}
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}

              <p>{experience.description}</p>

              <div className="flex flex-row flex-wrap items-center gap-2">
                {experience.skills.map((skill, skillIndex) => (
                  <p
                    key={skillIndex}
                    className="text-sm bg-form-option-active text-form-helper-hint px-3 py-1 rounded-full"
                  >
                    {skill}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExperienceTimeline;
