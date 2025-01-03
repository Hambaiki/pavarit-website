import Link from "next/link";
import { Suspense } from "react";

import { FaChevronRight, FaList } from "react-icons/fa6";

import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

import { blogItems } from "@/constants/blog";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";
import LatestPosts, {
  LatestPostsHeader,
  LatestPostsSkeleton,
} from "@/components/post/LatestPosts";
import FeaturedPosts, {
  FeaturedPostsHeader,
  FeaturedPostsSkeleton,
} from "@/components/post/FeaturedPosts";
import MorePostBanner from "@/components/post/MorePostBanner";

async function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  // async function create(formData: FormData) {
  //   "use server";
  //   // Connect to the Neon database
  //   const sql = neon(`${process.env.DATABASE_URL}`);
  //   const comment = formData.get("comment");
  //   // Insert the comment from the form into the Postgres database
  //   await sql("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  // }

  return (
    <MainContainer>
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="flex flex-col space-y-4 mt-8">
          <h1>Blog</h1>
          <p className="mt-4">
            {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
          </p>
        </div>
      </header>

      <section className="mt-10">
        <FeaturedPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<FeaturedPostsSkeleton />}>
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      <section className="mt-10 lg:mt-20">
        <div className="flex items-center space-x-2">
          <FaList className="h-6 w-6 text-suzuha-teal-500" />
          <h2>Categories</h2>
        </div>
        <p className="mt-4">
          {`Explore a wide range of topics and categories on my blog. Each category
            represents a different aspect of my interests and experiences.`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          {blogItems.map((item, index) => (
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
      </section>

      <section className="mt-10 lg:mt-20 space-y-8">
        <LatestPostsHeader />

        <Suspense fallback={<LatestPostsSkeleton />}>
          <LatestPosts />
        </Suspense>

        <div className="mt-8">
          <MorePostBanner />
        </div>
      </section>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const postData = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        limit: 4,
        tags: ["_featured"],
      }),
    }
  );
  const posts = postData?.posts || [];

  return {
    title: `Discover variety of articles on Pavarit Wiriyakunakorn's website - Pavarit's Website`,
    description: `Explore article about various topics such as ${posts
      .map((post) => post.title)
      .slice(0, 2)
      .join(", ")}, and more.`,
    keywords: [posts.flatMap((post) => post.keywords)],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
