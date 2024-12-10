import Link from "next/link";
import { format } from "date-fns";

import { getAllPosts } from "@/lib/posts";

import { FaCalendar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";

import Paginator from "@/components/Paginator";
import { Suspense } from "react";

async function page({ params }: { params: Promise<{ page: string }> }) {
  const perPage = 10;

  const page = parseInt((await params).page || "1", 10);
  const response = await getAllPosts({ page, perPage: perPage });

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
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="p-4 rounded-xl 
              bg-neutral-900 hover:bg-neutral-950 transition-colors"
          >
            <article className="space-y-3">
              <h2 className="text-2xl font-semibold">{post.title}</h2>

              <address className="flex flex-row items-center space-x-4 text-sm">
                <p className="flex flex-row items-center text-white not-italic">
                  <FaUser className="mr-2" />
                  {post.author}
                </p>
                <p className="flex flex-row items-center text-white not-italic">
                  <FaCalendar className="mr-2" />
                  {format(new Date(post.date), "yyyy/MM/dd")}
                </p>
              </address>

              <ul className="flex flex-row flex-wrap space-x-2">
                {post.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="p-4 bg-neutral-800 rounded-xl">
                <p className="text-neutral-300">{post.description}</p>
              </div>
            </article>
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

export default page;
