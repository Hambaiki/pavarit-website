import Link from "next/link";
import * as changeCase from "change-case";

import { getPostTags, getPosts } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import RecentPosts from "@/components/post/RecentPosts";
import MainHeader from "@/components/common/MainHeader";

async function TagPage() {
  const filteredTags = (await getPostTags()).filter(
    (tag) => !tag.startsWith("_"),
  );
  const posts = await getPosts();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: "Tags", href: "/posts/tag" },
  ];

  return (
    <MainContainer>
      <MainHeader
        title="Tags"
        description={`Explore all the tags on this website, including
          ${filteredTags.slice(0, 5).join(", ")}, and more.`}
        breadcrumbs={breadcrumbs}
      />

      <section className="mt-10">
        <h2>
          All Tags&nbsp;
          <span className="font-normal text-accent">
            ({filteredTags.length})
          </span>
        </h2>
        <ul className="flex flex-wrap gap-2 mt-4">
          {filteredTags.map((tag, index) => (
            <Link key={index} href={`/posts/tag/${tag}`}>
              <li
                className="text-base font-medium text-content-secondary px-4 py-1 rounded-full
                bg-surface-raised hover:bg-surface-muted transition-colors"
              >
                {changeCase.capitalCase(tag)}
              </li>
            </Link>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4">Latest Posts</h2>

        <RecentPosts posts={posts.slice(0, 4)} />
      </section>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const filteredTags = (await getPostTags()).filter(
    (tag) => !tag.startsWith("_"),
  );

  return {
    title: `View all post tags on this website - Pavarit's Website`,
    description: `Explore post tags on Pavarit Wiriyakunakorn's website, including ${filteredTags
      .slice(0, 5)
      .join(", ")}, and more.`,
    keywords: filteredTags,
    robots: "index, follow",
    alternates: {
      canonical: "/posts/tag",
    },
  };
}

export default TagPage;
