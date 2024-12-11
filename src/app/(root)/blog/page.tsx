import Link from "next/link";
import { format } from "date-fns";

import { getPosts } from "@/lib/posts";

import { FaCalendar } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";

import Paginator from "@/components/Paginator";
import { Suspense } from "react";
import Image from "next/image";

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
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="p-4 md:h-80 rounded-xl 
              bg-neutral-900 hover:bg-neutral-950 transition-colors"
          >
            <article className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="overflow-hidden">
                <Image
                  src={
                    post.image || "/images/placeholder/placeholder-image.jpg"
                  }
                  alt={post.title}
                  width={500}
                  height={500}
                  className="w-full h-48 md:h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col space-y-3">
                <h2 className="text-2xl font-semibold">{post.title}</h2>

                <address className="flex flex-row items-center space-x-4 text-sm">
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaUser className="mr-2" />
                    {post.author}
                  </p>
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaCalendar className="mr-2" />
                    {format(new Date(post.createDate), "yyyy/MM/dd")}
                  </p>
                </address>

                <ul className="flex flex-row flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>

                <div className="flex-1 p-4 bg-neutral-800 rounded-xl">
                  <p className="text-neutral-300 line-clamp-4">
                    {post.description}
                  </p>
                </div>
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
