import { FaBook, FaBriefcase, FaGraduationCap } from "react-icons/fa6";

export const featuredImages = [
  {
    src: "/images/photos/featured/graduation-day.jpg",
    alt: "Me on my graduation day",
    description:
      "Celebrating my graduation with a Bachelor's degree in Information and Communication Engineering from Chulalongkorn University.",
  },
  {
    src: "/images/photos/featured/friends-at-maneki.jpg",
    alt: "Me and my friends at Manekineko",
    description:
      "A karaoke outing with friends at Manekineko in Bangkok. I'm the one in the middle-left!",
  },
];

export const trainingImages = [
  {
    src: "/images/photos/batc/airside-day/c172s-hs-ptb-1.JPG",
    alt: "BATC C172S aircraft on the apron",
    description:
      "My first look at the training aircraft at BATC, before I had started real flight training.",
  },
  {
    src: "/images/photos/batc/airside-day/da42ng-hs-pts-1.JPG",
    alt: "BATC DA42NG during aircraft familiarization",
    description:
      "The DA42NG I got to see and learn about during an early exposure phase, before actual multi-engine flight training began.",
  },
  {
    src: "/images/photos/batc/fod-day/me-on-da42ng-1.JPG",
    alt: "Me with the DA42NG during a FOD day",
    description:
      "A memorable BATC day where I got to take photos with the DA42NG that will be used for real multi-engine training later on, not yet actual flight training.",
  },
];

export const aboutItems = [
  {
    title: "Experience",
    description: "My work experiences and projects.",
    href: "#experience",
    icon: FaBriefcase,
  },
  {
    title: "Pilot Training",
    description: "My aviation journey and current student pilot training.",
    href: "#training",
    icon: FaBook,
  },
  {
    title: "Education",
    description: "About my education journey.",
    href: "#education",
    icon: FaGraduationCap,
  },
  // {
  //   title: "Projects",
  //   description: "My projects and experiences.",
  //   href: "/about/projects",
  //   icon: FaBook,
  // },
];

export const tableOfContents = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Pilot Training", href: "#training" },
  { label: "Education", href: "#education" },
];

export const experiences = [
  {
    title: "Junior Frontend Developer",
    type: "Full-time",
    company: {
      name: "Agnos Health Co., Ltd.",
      logo: "/images/logo/company/agnos-health-logo.jpg",
    },
    description: "Developed and maintained web applications.",
    duration: "2024 - Ongoing",
    location: "Bangkok, Thailand",
    skills: ["ReactJS", "NextJS", "TypeScript", "NodeJS", "AWS"],
  },
  {
    title: "Teaching Assistant",
    type: "Part-time",
    company: {
      name: "Chulalongkorn University",
      logo: "/images/logo/school/chula-logo.png",
    },
    description:
      "Teaching assistant for the course of Principles of Telecommunication",
    duration: "2024",
    location: "Bangkok, Thailand",
    skills: ["Computer", "Network", "Telecommunication", "Encryption"],
  },
  {
    title: "Frontend Developer Intern",
    type: "Part-time",
    company: {
      name: "Agnos Health Co., Ltd.",
      logo: "/images/logo/company/agnos-health-logo.jpg",
    },
    description: "Developed and maintained web applications.",
    duration: "2023",
    location: "Bangkok, Thailand",
    skills: ["ReactJS", "NextJS", "TypeScript", "NodeJS", "AWS"],
  },
  {
    title: "Frontend Developer Intern",
    type: "Full-time",
    company: {
      name: "Agnos Health Co., Ltd.",
      logo: "/images/logo/company/agnos-health-logo.jpg",
    },
    description: "Developed and maintained web applications.",
    duration: "2023",
    location: "Bangkok, Thailand",
    skills: ["ReactJS", "NextJS", "TypeScript", "NodeJS", "AWS"],
  },
];

export const education = [
  {
    level: "Bachelor Degree",
    educations: [
      {
        title: "Information and Communication Engineering",
        duration: "2020 - 2023",
        location: "Chulalongkorn University",
        image: "/images/logo/school/chula-logo.png",
      },
    ],
  },
  {
    level: "High School",
    educations: [
      {
        title: "Grade 11, Semester 2 - Grade 12",
        duration: "2018 - 2019",
        location: "Santirat Wittayalai School",
        image: "/images/logo/school/sl-logo.png",
      },
      {
        title: "Year 1, semester 1",
        duration: "2018",
        location: "Armed Forces Academies Preparatory School (AFAPS)",
        image: "/images/logo/school/afaps-logo.png",
      },
      {
        title: "Grade 10",
        duration: "2016",
        location: "Triam Udom Suksa Phatthanakarn School",
        image: "/images/logo/school/tup-logo.png",
      },
    ],
  },
  {
    level: "Middle School",
    educations: [
      {
        title: "Grade 7-9",
        duration: "2013 - 2015",
        location: "Triam Udom Suksa Phatthanakarn School",
        image: "/images/logo/school/tup-logo.png",
      },
    ],
  },
  {
    level: "Elementary School",
    educations: [
      {
        title: "Grade 3-6",
        duration: "2009 - 2012",
        location: "Panaya Phattanakarn Bilingual School",
        image: "/images/logo/school/ppbs-logo.png",
      },
      {
        title: "Grade 1-2",
        duration: "2007 - 2008",
        location: "Panaya Phattanakarn School",
        image: "/images/logo/school/ppbs-logo.png",
      },
    ],
  },
  {
    level: "Kindergarten",
    educations: [
      {
        title: "K3, Semester 2",
        duration: "2006",
        location: "Panaya Phattanakarn Kindergarten School",
        image: "/images/logo/school/ppbs-logo.png",
      },
      {
        title: "K3, Semester 1",
        duration: "2006",
        location: "Saint Joseph Sriphetchabun School",
        image: "/images/logo/school/sjs-logo.png",
      },
      {
        title: "K1 - K2",
        duration: "2004-2005",
        location: "Panaya School Sukhumvit",
        image: "/images/logo/school/ppbs-logo.png",
      },
    ],
  },
];
