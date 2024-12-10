import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";

async function page() {
  const posts = getAllPosts();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Blogs</h1>
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
            className="flex flex-col space-y-2 p-4 rounded-xl 
              bg-neutral-900 hover:bg-neutral-950 transition-colors"
          >
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-neutral-300">{post.author}</p>

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

            {/* <div className="p-4 bg-neutral-800 rounded-xl">
              <p className="text-neutral-300">{blog.content}</p>
            </div> */}
          </Link>
        ))}
      </div>
    </MainContainer>
  );
}

export default page;
