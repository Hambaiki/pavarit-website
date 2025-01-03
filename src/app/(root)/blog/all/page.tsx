import Link from "next/link";
import { Suspense } from "react";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";

import Paginator from "@/components/Paginator";
import PostItem from "@/components/post/PostItem";
import SearchBar from "@/components/post/SearchBar";
import { SearchPostResponse } from "@/types/api/post";
import { fetchFromApi } from "@/lib/api";

async function page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    sort?: string;
  };
}) {
  const limit = 4;

  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";
  const sort = searchParams.sort || "MOST_RECENT";

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

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>All Posts</h1>
          <p>
            Here are all of my posts. I write about my experiences and thoughts
            about technology, life, and other things.
          </p>
        </div>
      </header>

      <div className="mt-8">
        <SearchBar showSortOptions />
      </div>

      <Suspense>
        <div className="flex flex-col space-y-8 mt-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <PostItem
                image={post.image}
                title={post.title}
                author={post.author}
                createDate={post.created_at}
                tags={post.tags}
                description={post.description}
                className="md:h-80"
              />
            </Link>
          ))}
        </div>

        {maxPage > 1 && (
          <div className="mt-8">
            <Paginator currentPage={page} maxPage={maxPage} />
          </div>
        )}
      </Suspense>
    </MainContainer>
  );
}

// export async function generateMetadata() {
//   const postData = await getPosts();
//   const posts = postData.posts;

//   return {
//     title: `Discover variety of articles on Pavarit Wiriyakunakorn's website`,
//     description: `Explore article about various topics such as ${posts
//       .map((post) => post.title)
//       .slice(0, 2)
//       .join(", ")}, and more.`,
//     keywords: [posts.flatMap((post) => post.tags.map((tag) => tag.name))],
//     robots: "index, follow",
//     alternates: {
//       canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
//     },
//   };
// }

export default page;
