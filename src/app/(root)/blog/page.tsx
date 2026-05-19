import { Suspense } from "react";

import { FaList } from "react-icons/fa6";

import MainHeader from "@/components/common/MainHeader";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";
import SectionHeader from "@/components/common/SectionHeader";
import MainContainer from "@/components/container/MainContainer";
import FeaturedPosts, {
  FeaturedPostsHeader,
  FeaturedPostsSkeleton,
} from "@/components/post/FeaturedPosts";
import LatestPosts, {
  LatestPostsHeader,
  LatestPostsSkeleton,
} from "@/components/post/LatestPosts";
import MorePostBanner from "@/components/post/MorePostBanner";
import { blogItems } from "@/constants/blog";
import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

async function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <MainContainer className="space-y-10 lg:space-y-16">
      <MainHeader
        title={`Blog`}
        description={`Discover more about myself with a collection of topics ranging from
          personal growth and creative projects to technical tutorials and
          deep thoughts about life. This is a place where I share my journey
          and experiences for exploration and connection.`}
        breadcrumbs={breadcrumbs}
      />

      <section>
        <FeaturedPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<FeaturedPostsSkeleton />}>
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      <section>
        <LatestPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<LatestPostsSkeleton />}>
            <LatestPosts />
          </Suspense>
        </div>

        <div className="mt-4">
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
