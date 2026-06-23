import { Suspense } from "react";

import Link from "next/link";

import Paginator from "@/components/Paginator";
import { Section } from "@/components/content";
import Header from "@/components/content/Header";
import Loading from "@/components/navigation/Loading";
import PostItemAlt from "@/components/post/PostItemAlt";
import SearchBar from "@/components/post/SearchBar";
import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const limit = 4;

  const {
    page: pageParam,
    search: searchParam,
    sort: sortParam,
  } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const search = searchParam || "";
  const sort = sortParam || "MOST_RECENT";

  const response = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search/`,
    "POST",
    {
      body: JSON.stringify({
        page: page,
        limit: limit,
        search: search,
        sort: sort,
      }),
    }
  );

  const maxPage = Math.ceil((response?.total || 0) / limit);
  const posts = response?.posts || [];

  return (
    <>
      <Header
        title="All Posts"
        description="Here are all of my posts. I write about my experiences and thoughts
            about technology, life, and other things."
        breadcrumbs={breadcrumbs}
      />

      <Section className="space-y-8">
        <SearchBar showSortOptions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <PostItemAlt
                image={post.image}
                title={post.title}
                author={post.author}
                createDate={post.created_at}
                tags={post.tags}
                // description={post.description}
                // className="md:h-80"
              />
            </Link>
          ))}
        </div>

        <Suspense fallback={<Loading />}>
          {maxPage > 1 && <Paginator currentPage={page} maxPage={maxPage} />}
        </Suspense>
      </Section>
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `Discover variety of articles on Pavarit Wiriyakunakorn's website`,
    description: `Explore article about various topics.`,
    keywords: ["Blog", "Articles", "Tech", "Life", "Programming"],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
