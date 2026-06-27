import { Suspense } from "react";

import Link from "next/link";

import { FaQuestionCircle } from "react-icons/fa";

import Paginator from "@/components/Paginator";
import { Section } from "@/components/content";
import { Header } from "@/components/content";
import Loading from "@/components/navigation/Loading";
import { serverGetPosts } from "@/features/blog/actions";
import NoPost from "@/features/blog/components/post/NoPost";
import PostItemAlt from "@/features/blog/components/post/PostItemAlt";
import SearchBar from "@/features/blog/components/post/SearchBar";

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
  const sort = (sortParam || "MOST_RECENT") as "MOST_RECENT";

  const response = await serverGetPosts({
    page: page,
    limit: limit,
    search: search,
    sort: sort,
  });

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

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <PostItemAlt
                  image={post.image}
                  title={post.title}
                  author={post.author}
                  createDate={post.createdAt}
                  tags={post.tags}
                  // description={post.description}
                  // className="md:h-80"
                />
              </Link>
            ))}
          </div>
        ) : (
          <NoPost search={search} />
        )}

        <Suspense fallback={<Loading />}>
          {maxPage > 1 && <Paginator currentPage={page} maxPage={maxPage} />}
        </Suspense>
      </Section>
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `Discover variety of posts on Pavarit Wiriyakunakorn's website`,
    description: `Explore posts about various topics.`,
    keywords: ["Blog", "Posts", "Articles", "Tech", "Life", "Programming"],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
