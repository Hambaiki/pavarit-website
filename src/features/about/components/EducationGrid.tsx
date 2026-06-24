import Image from "next/image";

import Card from "@/components/ui/Card";

interface EducationEntry {
  title: string;
  duration: string;
  location: string;
  image?: string;
}

interface EducationLevel {
  level: string;
  educations: EducationEntry[];
}

interface EducationGridProps {
  items: EducationLevel[];
}

function EducationGrid({ items }: EducationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {items.map((educationLevel, index) => (
        <Card key={index} className="p-4 space-y-4">
          <h3>{educationLevel.level}</h3>

          {educationLevel.educations.map((education, educationIndex) => (
            <div key={educationIndex} className="flex flex-col space-y-2">
              <p>{education.title}</p>

              <div className="flex flex-row items-center space-x-4 p-2 bg-gray-100 rounded-lg">
                {education.image && (
                  <Image
                    src={education.image}
                    alt={education.location}
                    width={100}
                    height={100}
                    className="object-contain w-12 h-12 p-1 shrink-0 bg-gray-200 rounded-full"
                  />
                )}
                <p className="flex flex-col">
                  <span>{education.location}</span>
                  <span>{education.duration}</span>
                </p>
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

export default EducationGrid;
