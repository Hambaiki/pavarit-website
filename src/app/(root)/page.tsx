import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";

import { FaChevronRight } from "react-icons/fa";

import { introItems } from "@/constants/home";

import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import FeaturedPosts, {
  FeaturedPostsHeader,
  FeaturedPostsSkeleton,
} from "@/components/post/FeaturedPosts";
import MorePostBanner from "@/components/post/MorePostBanner";

async function HomePage() {
  return (
    <MainContainer>
      <section className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 md:gap-8 rounded-xl p-8 md:p-12 bg-gray-850">
        <div className="p-0">
          <h1>{"Hi! I'm Pavarit"}</h1>
          <h2 className="text-suzuha-teal-500 mt-1">
            {"Glad to have you here!"}
          </h2>
          <p className="mt-4">
            {"Frontend Developer passionate about developing web application."}
          </p>

          <div className="flex flex-row gap-4 mt-6">
            <Button
              href="/contact"
              className="w-32 h-12 rounded-lg"
              variant="secondary"
            >
              Get in Touch
            </Button>
            <Button
              href="/about"
              className="w-32 h-12 rounded-lg"
              variant="primary"
            >
              Learn More
            </Button>
          </div>
        </div>

        <Image
          src="/images/profile/pavarit.jpg"
          alt="Profile"
          width={1500}
          height={1500}
          className="h-64 w-64 md:h-96 md:w-96 rounded-full object-cover object-center
            border-4 border-suzuha-teal-500"
        />
      </section>

      <section className="mt-14">
        <h2>Get Started</h2>
        <p className="mt-4">
          {`Explore my website to learn more about me and my journey. You can
            find my personal blog, projects, and more.`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          {introItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex flex-row items-center space-x-4 p-4 rounded-lg
                bg-gray-850 hover:bg-gray-800 transition-colors"
            >
              <item.icon className="text-suzuha-teal-500 w-5 h-5" />

              <div className="flex-1 flex flex-col">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-base">{item.description}</p>
              </div>

              <FaChevronRight className="text-suzuha-teal-500" />
            </Link>
          ))}
        </div>

        <div className="flex md:flex-row flex-col justify-between items-center gap-4 p-4 mt-4 bg-gray-900 rounded-xl">
          <p className="text-center">
            This website is a progressive web application.&nbsp;
            <span className="text-suzuha-teal-500">
              Try adding to home screen!
            </span>
          </p>
        </div>
      </section>

      <section className="mt-14">
        <FeaturedPostsHeader />

        <p className="mt-4">
          {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
        </p>

        <div className="mt-8">
          <Suspense fallback={<FeaturedPostsSkeleton />}>
            <FeaturedPosts />
          </Suspense>
        </div>

        <div className="mt-8">
          <MorePostBanner />
        </div>
      </section>
    </MainContainer>
  );
}

export const metadata: Metadata = {
  title: "Pavarit (Guide) Wiriyakunakorn's Website",
  description:
    "I am Pavarit Wiriyakunakorn, and this is a space where I share my journey, ideas, and discoveries.",
  keywords: [
    "Pavarit Wiriyakunakorn",
    "Guide",
    "Developer Portfolio",
    "Web Developer",
    "Personal Blog",
    "Projects",
    "Tech Enthusiast",
    "Software Engineering",
    "Thailand",
    "Bangkok",
    "Chulalongkorn University",
    "Information and Communication Engineering",
    "Frontend Developer",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Pavarit (Guide) Wiriyakunakorn's Website",
    description:
      "I am Pavarit Wiriyakunakorn, and this is a space where I share my journey, ideas, and discoveries.",
    siteName: "Pavarit's Website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    images: [
      {
        url: "/images/profile/pavarit.jpg",
        width: 1200,
        height: 630,
        alt: "Pavarit (Guide) Wiriyakunakorn's Website",
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@yourTwitterHandle",
  //   creator: "@yourTwitterHandle",
  // },
};

export default HomePage;
