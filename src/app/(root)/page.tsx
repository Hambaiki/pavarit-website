import Image from "next/image";
import { Metadata } from "next";
import { FaFlag } from "react-icons/fa6";

import { introItems } from "@/constants/home";
import { getPosts } from "@/lib/posts";

import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import FeaturedPosts, {
  FeaturedPostsHeader,
} from "@/components/post/FeaturedPosts";
import MorePostBanner from "@/components/post/MorePostBanner";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";

async function HomePage() {
  const posts = await getPosts();
  const featuredPosts = posts.filter((post) => post.tags.includes("_featured"));

  return (
    <MainContainer className="space-y-14">
      <section className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 md:gap-8 rounded-xl bg-surface overflow-hidden">
        <div className="flex-1 p-8 md:p-12">
          <h1>{"Hi! I'm Pavarit"}</h1>
          <h2 className="text-accent mt-1">{"Glad to have you here!"}</h2>
          <p className="mt-4">
            {
              "Frontend Developer and Student Pilot pursuing CPL/IR with ATP theory."
            }
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

        <div className="flex-1 w-full h-80 md:h-full">
          <Image
            src="/images/profile/pavarit.jpg"
            alt="Profile"
            width={1500}
            height={1500}
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2">
          <FaFlag className="h-6 w-6 text-accent" />
          <h2>Get Started</h2>
        </div>
        <p className="mt-4">
          {`Explore my website to learn more about me and my journey. You can
            find my background, writing, and training updates here.`}
        </p>

        <OptionMenuGrid items={introItems} />

        <div className="flex md:flex-row flex-col justify-between items-center gap-4 p-4 mt-4 bg-surface rounded-xl">
          <p className="text-center">
            This website is a progressive web application.&nbsp;
            <span className="text-accent">Try adding to home screen!</span>
          </p>
        </div>
      </section>

      <section>
        <FeaturedPostsHeader />

        <p className="mt-4">
          {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
        </p>

        <div className="mt-8">
          <FeaturedPosts posts={featuredPosts.slice(0, 4)} />
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
    "Personal Posts",
    "Tech Enthusiast",
    "Software Engineering",
    "Thailand",
    "Bangkok",
    "Chulalongkorn University",
    "Information and Communication Engineering",
    "Frontend Developer",
    "Student Pilot",
    "CPL",
    "IR",
    "ATP Theory",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Pavarit (Guide) Wiriyakunakorn's Website",
    description:
      "I am Pavarit Wiriyakunakorn, and this is a space where I share my journey, ideas, and discoveries.",
    siteName: "Pavarit's Website",
    url: "/",
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
    canonical: "/",
  },
};

export default HomePage;
