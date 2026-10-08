import Link from "next/link";
import type { Metadata } from "next";
import { filterPosts, getPosts } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import Paginator from "@/components/Paginator";
import SearchBar from "@/components/post/SearchBar";
import MainHeader from "@/components/common/MainHeader";
import PostItemAlt from "@/components/post/PostItemAlt";

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const limit = 4;

  const requestedPage = Number.parseInt(resolvedSearchParams.page || "1", 10);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const search = resolvedSearchParams.search || "";
  const filteredPosts = filterPosts(await getPosts(), { search });
  const maxPage = Math.ceil(filteredPosts.length / limit);
  const posts = filteredPosts.slice((page - 1) * limit, page * limit);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
  ];

  return (
    <MainContainer>
      <MainHeader
        title="All Posts"
        description="Here are all of my posts. I write about my experiences and thoughts
            about technology, life, and other things."
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-8">
        <SearchBar search={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <PostItemAlt
              image={post.image}
              title={post.title}
              author={post.author}
              createDate={post.created_at}
              tags={post.tags}
              sizes="(max-width: 1023px) 100vw, 50vw"
              eager={index === 0}
            />
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-8 text-center text-content-secondary">
          No posts found.
        </p>
      )}

      {maxPage > 1 && (
        <div className="mt-8">
          <Paginator currentPage={page} maxPage={maxPage} />
        </div>
      )}
    </MainContainer>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}): Promise<Metadata> {
  const { page = "1", search = "" } = await searchParams;
  const requestedPage = Number.parseInt(page, 10);
  const isFilteredOrPaginated =
    Boolean(search.trim()) ||
    (Number.isInteger(requestedPage) && requestedPage > 1);

  return {
    title: `All posts by Pavarit Wiriyakunakorn`,
    description: `Explore posts about various topics.`,
    keywords: ["Posts", "Tech", "Life", "Programming"],
    robots: isFilteredOrPaginated ? "noindex, follow" : "index, follow",
    alternates: {
      canonical: "/posts/all",
    },
  };
}

export default page;
