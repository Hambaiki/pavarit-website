import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { Suspense } from "react";

import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";
import Button from "@/components/Button";
import LatestPosts, {
  LatestPostsHeader,
  LatestPostsSkeleton,
} from "@/components/post/LatestPosts";
import FeaturedPosts, {
  FeaturedPostsHeader,
  FeaturedPostsSkeleton,
} from "@/components/post/FeaturedPosts";

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
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>Blog</h1>
          <p className="mt-4">
            {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
          </p>
        </div>
      </header>

      <section className="mt-16">
        <FeaturedPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<FeaturedPostsSkeleton />}>
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <LatestPostsHeader />

        <Suspense fallback={<LatestPostsSkeleton />}>
          <LatestPosts />
        </Suspense>
      </section>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 p-4 bg-gray-850 rounded-xl">
        <p className="text-center md:text-left">
          Interested in my other posts?
          <strong> Check out other posts here!</strong>
        </p>
        <Button
          href="/blog/all"
          variant="primary"
          className="px-4 py-2 rounded-full"
        >
          View More Posts
        </Button>
      </div>
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
    title: `Discover variety of articles on Pavarit Wiriyakunakorn's website`,
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
