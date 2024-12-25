import React from "react";
import Link from "next/link";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import RecentPosts from "@/components/post/RecentPosts";

import { fetchFromApi } from "@/lib/api";
import { TagResponse } from "@/types/api/post";

async function TagPage() {
  const response = await fetchFromApi<TagResponse>("/api/v1/posts/tag");

  const tags = response?.tags || [];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tag", href: "/blog/tag" },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col space-y-4 mt-8">
        <h1>All Tags</h1>
      </div>

      <ul className="flex flex-wrap gap-2 mt-4">
        {tags
          .filter((tag) => !tag.includes("_"))
          .map((tag, index) => (
            <Link key={index} href={`/blog/tag/${tag}`}>
              <li
                className="text-base font-medium text-white px-4 py-1 rounded-full
                bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </li>
            </Link>
          ))}
      </ul>

      <section className="mt-8">
        <h3 className="mb-4">Latest Articles</h3>

        <RecentPosts />
      </section>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const response = await fetchFromApi<TagResponse>("/api/v1/posts/tag");

  const tags = response?.tags || [];

  return {
    title: `View all article tags on Pavarit Wiriyakunakorn's website`,
    description: `Explore article tags on Pavarit Wiriyakunakorn's website, including ${tags
      .slice(0, 5)
      .join(", ")}, and more.`,
    keywords: [tags.map((tag) => tag)],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/tag`,
    },
  };
}

export default TagPage;
