import { FaList } from "react-icons/fa6";

import { getPosts } from "@/lib/posts";

import { blogItems } from "@/constants/posts";

import MainContainer from "@/components/container/MainContainer";
import LatestPosts, { LatestPostsHeader } from "@/components/post/LatestPosts";
import FeaturedPosts, {
  FeaturedPostsHeader,
} from "@/components/post/FeaturedPosts";
import MorePostBanner from "@/components/post/MorePostBanner";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";
import MainHeader from "@/components/common/MainHeader";
import SectionHeader from "@/components/common/SectionHeader";

async function page() {
  const posts = await getPosts();
  const featuredPosts = posts.filter((post) => post.tags.includes("_featured"));

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
  ];

  return (
    <MainContainer className="space-y-10 lg:space-y-16">
      <MainHeader
        title="Posts"
        description={`Discover more about myself with a collection of topics ranging from
          personal growth and creative projects to technical tutorials and
          deep thoughts about life. This is a place where I share my journey
          and experiences for exploration and connection.`}
        breadcrumbs={breadcrumbs}
      />

      {featuredPosts.length > 0 && (
        <section>
          <FeaturedPostsHeader />
          <div className="mt-8">
            <FeaturedPosts posts={featuredPosts.slice(0, 4)} eagerFirstImage />
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          title={`Categories`}
          icon={FaList}
          description={`Explore a wide range of topics and categories in my posts. Each category
            represents a different aspect of my interests and experiences.`}
        />

        <OptionMenuGrid items={blogItems} />
      </section>

      <section>
        <LatestPostsHeader />
        <div className="mt-8">
          <LatestPosts posts={posts.slice(0, 4)} />
        </div>
        <div className="mt-4">
          <MorePostBanner />
        </div>
      </section>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const posts = await getPosts();

  return {
    title: `Discover posts by Pavarit Wiriyakunakorn - Pavarit's Website`,
    description: `Explore posts about various topics such as ${posts
      .map((post) => post.title)
      .slice(0, 2)
      .join(", ")}, and more.`,
    keywords: posts.flatMap((post) => post.keywords),
    robots: "index, follow",
    alternates: {
      canonical: "/posts",
    },
  };
}

export default page;
