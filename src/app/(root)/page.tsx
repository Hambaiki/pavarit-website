import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

import { introItems } from "@/constants/home";

import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import RecentPosts from "@/components/post/RecentPosts";
import { FaChevronRight } from "react-icons/fa";
import FeaturedPosts, {
  FeaturedPostsSkeleton,
} from "@/components/post/FeaturedPosts";
import { Suspense } from "react";

async function Home() {
  return (
    <MainContainer>
      <section className="flex flex-col-reverse sm:flex-row justify-center items-center gap-6 md:gap-8">
        <div className="p-0">
          <h1 className="text-4xl font-bold">{"Hi! I'm Pavarit"}</h1>
          <h2 className="text-2xl font-semibold text-suzuha-teal-500 mt-1">
            {"Glad to have you here!"}
          </h2>
          <p className="text-xl text-neutral-300 mt-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 bg-neutral-900 rounded-xl p-2">
          {introItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex flex-row items-center space-x-4 p-3 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-lg"
            >
              <div className="flex-1 flex flex-col">
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="text-sm text-neutral-300">{item.description}</p>
              </div>

              <FaChevronRight className="text-suzuha-teal-500" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 p-4 bg-neutral-900 rounded-xl">
        <h2 className="text-2xl font-bold">
          {`This is a space where I share my journey, ideas, and discoveries.`}
        </h2>
        {/* <p className="text-lg text-neutral-300 mt-4">
          {`This is a space where I share my journey, ideas, and discoveries.
            Whether you're here to learn, be inspired, or simply explore, you're
            in the right place.`}
        </p> */}

        {/* <p className="text-lg text-neutral-300 mt-4">
          {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
        </p> */}

        {/* <p className="text-neutral-300 mt-2">
          {`I’m Pavarit Wiriyakunakorn, and this is a space where I share my
          journey, ideas, and discoveries. I’m a curious Frontend Developer and
          a lifelong learner who loves turning ideas into intuitive, responsive
          web experiences.`}
        </p> */}

        <p className="text-neutral-300 mt-2">
          {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
        </p>
      </section>

      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-bold">Explore My Featured Articles</h2>

        <Suspense fallback={<FeaturedPostsSkeleton />}>
          <FeaturedPosts />
        </Suspense>
      </section>

      {/* <section className="mt-8 p-4 bg-neutral-900 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">
            What Will You Find Here?
          </h3>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">In-Depth Articles:</span>{" "}
              Detailed posts on topics I’m passionate about, ranging from coding
              tips to personal reflections.
            </li>
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">Creative Projects:</span>{" "}
              Showcasing my artistic ventures, from digital art to storytelling.
            </li>
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">Resource Hub:</span>{" "}
              Curated tools, links, and guides to help you on your journey.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4 mt-8">
            Why I Built This Place
          </h3>
          <p className="text-base text-neutral-300 mt-4">
            In a world overflowing with content, I wanted to carve out a small
            sanctuary—a personal space where I can share my authentic self and
            connect with others.
          </p>
          <p className="text-base text-neutral-300 mt-4">
            This site is not just about sharing; it’s about growth. It’s about
            learning from experiences, embracing creativity, and finding joy in
            the little things. I hope you find something here that resonates
            with you.
          </p>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Let's Connect!</h3>
          <p className="text-base text-neutral-300 mt-4">
            I’d love to hear from you! Feel free to{" "}
            <a
              href="/contact"
              className="text-suzuha-teal-400 hover:text-suzuha-teal-300 underline"
            >
              reach out
            </a>{" "}
            with your thoughts, feedback, or just to say hi.
          </p>
        </section> */}
    </MainContainer>
  );
}

export const metadata: Metadata = {
  title: "Pavarit (Guide) Wiriyakunakorn's Website",
  description:
    "I am Pavarit Wiriyakunakorn, and this is a space where I share my journey, ideas, and discoveries.",
  keywords: [
    "Pavarit Wiriyakunakorn",
    "Guide Wiriyakunakorn",
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

export default Home;
