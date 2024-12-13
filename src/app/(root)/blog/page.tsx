import Link from "next/link";
import { Suspense } from "react";

import { getPosts } from "@/lib/posts";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";

import Paginator from "@/components/Paginator";
import PostItem from "@/components/post/PostItem";

async function page({ params }: { params: Promise<{ page: string }> }) {
  const perPage = 5;

  const page = parseInt((await params).page || "1", 10);
  const response = await getPosts({ page, perPage: perPage });

  const maxPage = Math.ceil(response.total / perPage);
  const posts = response.posts;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-neutral-300">
            Here are some of my blogs. I write about my experiences and thoughts
            about technology, life, and other things.
          </p>
        </div>
      </header>

      <div className="flex flex-col space-y-4 mt-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <PostItem
              image={post.image}
              title={post.title}
              author={post.author}
              createDate={post.createDate}
              tags={post.tags.map((tag) => tag.name)}
              description={post.description}
            />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Suspense>
          <Paginator currentPage={page} maxPage={maxPage} />
        </Suspense>
      </div>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const postData = await getPosts();
  const posts = postData.posts;

  return {
    title: `Discover variety of articles on Pavarit Wiriyakunakorn's website`,
    description: `Explore article about various topics such as ${posts
      .map((post) => post.title)
      .slice(0, 2)
      .join(", ")}, and more.`,
    keywords: [posts.flatMap((post) => post.tags.map((tag) => tag.name))],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
