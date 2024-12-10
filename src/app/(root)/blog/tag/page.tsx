import React from "react";
import Link from "next/link";

import { getAllTags } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import RecentPosts from "@/components/post/RecentPosts";

async function TagPage() {
  const tags = await getAllTags();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tag", href: "/blog/tag" },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col space-y-4 mt-8">
        <h1 className="text-4xl font-bold">All Tags</h1>
      </div>

      <ul className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag, index) => (
          <Link key={index} href={`/blog/tag/${tag}`}>
            <li
              className="text-base font-medium text-white px-4 py-1 rounded-full
                bg-neutral-900 hover:bg-black transition-colors"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </li>
          </Link>
        ))}
      </ul>

      <section className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Latest Articles</h3>

        <RecentPosts />
      </section>
    </MainContainer>
  );
}

export default TagPage;
