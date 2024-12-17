import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { Suspense } from "react";

import { fetchFromApi } from "@/utils/api";
import { SearchPostResponse } from "@/types/api/post";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";
import Button from "@/components/Button";
import LatestPosts, {
  FallbackLatestPosts,
} from "@/components/post/LatestPosts";
import FeaturedPosts, {
  FallbackFeaturedPosts,
} from "@/components/post/FeaturedPosts";

async function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  async function create(formData: FormData) {
    "use server";
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get("comment");
    // Insert the comment from the form into the Postgres database
    await sql("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  }

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-neutral-300">
            Here are some of my blogs. I write about my experiences and thoughts
            about technology, life, and other things.
          </p>
        </div>
      </header>

      <Suspense fallback={<FallbackFeaturedPosts className="mt-12" />}>
        <FeaturedPosts className="mt-12" />
      </Suspense>

      <Suspense fallback={<FallbackLatestPosts className="mt-12" />}>
        <div className="mt-12">
          <LatestPosts />
        </div>
      </Suspense>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 p-4 bg-neutral-950 rounded-xl">
        <p className="text-center md:text-left text-neutral-300">
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
        per_page: 4,
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
