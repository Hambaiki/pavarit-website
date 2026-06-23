import Link from "next/link";

import * as changeCase from "change-case";

import { Section } from "@/components/content";
import Header from "@/components/content/Header";
import RecentPosts from "@/components/post/RecentPosts";
import { fetchFromApi } from "@/lib/api";
import { TagResponse } from "@/types/api/post";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Tag", href: "/blog/tag" },
];

async function TagPage() {
  const response = await fetchFromApi<TagResponse>("/api/v1/posts/tag");

  const tags = response?.tags || [];
  const filteredTags = tags.filter((tag) => !tag.includes("_"));

  return (
    <>
      <Header
        title="Tags"
        description={`Explore all the tags on this website, including
          ${filteredTags.slice(0, 5).join(", ")}, and more.`}
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <h2>
          All Tags&nbsp;
          <span className="font-normal text-primary-500">
            ({filteredTags.length})
          </span>
        </h2>
        <ul className="flex flex-wrap gap-2 mt-4">
          {filteredTags.map((tag, index) => (
            <Link key={index} href={`/blog/tag/${tag}`}>
              <li
                className="text-base font-medium text-gray-800 px-4 py-1 rounded-full
                bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {changeCase.capitalCase(tag)}
              </li>
            </Link>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="mb-4">Latest Articles</h2>

        <RecentPosts />
      </Section>
    </>
  );
}

export async function generateMetadata() {
  const response = await fetchFromApi<TagResponse>("/api/v1/posts/tag");

  const tags = response?.tags || [];
  const filteredTags = tags.filter((tag) => !tag.includes("_"));

  return {
    title: `View all article tags on this website - Pavarit's Website`,
    description: `Explore article tags on Pavarit Wiriyakunakorn's website, including ${filteredTags
      .slice(0, 5)
      .join(", ")}, and more.`,
    keywords: [filteredTags.map((tag) => tag)],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/tag`,
    },
  };
}

export default TagPage;
