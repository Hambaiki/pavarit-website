import { Suspense } from "react";

import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { serverGetPosts } from "@/features/blog/actions";
import FeaturedPosts, {
  FeaturedPostsHeader,
  FeaturedPostsSkeleton,
} from "@/features/blog/components/post/FeaturedPosts";
import LatestPosts, {
  LatestPostsHeader,
  LatestPostsSkeleton,
} from "@/features/blog/components/post/LatestPosts";
import MorePostBanner from "@/features/blog/components/post/MorePostBanner";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

async function page() {
  return (
    <>
      <Header
        title={`Blog`}
        description={`Discover more about myself with a collection of topics ranging from
          personal growth and creative projects to technical tutorials and
          deep thoughts about life. This is a place where I share my journey
          and experiences for exploration and connection.`}
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <FeaturedPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<FeaturedPostsSkeleton />}>
            <FeaturedPosts />
          </Suspense>
        </div>
      </Section>

      <Section>
        <LatestPostsHeader />

        <div className="mt-8">
          <Suspense fallback={<LatestPostsSkeleton />}>
            <LatestPosts />
          </Suspense>
        </div>

        <div className="mt-4">
          <MorePostBanner />
        </div>
      </Section>
    </>
  );
}

export async function generateMetadata() {
  const postData = await serverGetPosts({
    page: 1,
    limit: 4,
    tags: ["_featured"],
  });

  const posts = postData?.posts || [];

  return {
    title: `Discover variety of posts on Pavarit Wiriyakunakorn's website - Pavarit's Website`,
    description: `Explore posts about various topics such as ${posts
      .map((post: any) => post.title)
      .slice(0, 2)
      .join(", ")}, and more.`,
    keywords: [posts.flatMap((post: any) => post.keywords)],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
