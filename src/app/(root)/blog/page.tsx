import { Suspense } from "react";

import { FaList } from "react-icons/fa6";

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
import OptionMenuGrid from "@/components/common/OptionMenuGrid";

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

        <OptionMenuGrid items={blogItems} />
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
