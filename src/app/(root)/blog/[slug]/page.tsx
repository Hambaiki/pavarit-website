import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";

import { getPostBySlug } from "@/lib/posts";

import { FaCalendar, FaUser } from "react-icons/fa";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostRenderer from "@/components/post/PostRenderer";
import ShareOptions from "@/components/post/ShareOptions";
import RecentPosts from "@/components/post/RecentPosts";
import PostImage from "@/components/post/PostImage";

async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  const contentHtml = post.contentHtml || "";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <ul className="flex flex-row flex-wrap space-x-2">
            {post.tags.map((tag, index) => (
              <Link href={`/blog/tag/${tag.slug}`} key={index}>
                <li
                  key={index}
                  className="px-3 py-1 rounded-full 
                  text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-900 transition-colors
                  border border-primary-gray-border"
                >
                  {tag.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </header>

      <div className="flex flex-col-reverse lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="flex-1 my-8">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={1000}
              height={1000}
              className="rounded-xl w-full h-auto mb-8"
            />
          )}

          <PostRenderer contentHtml={contentHtml} />
        </div>

        <div className="lg:sticky lg:top-0 lg:h-full lg:w-72 lg:py-8">
          <address className="flex flex-row items-center space-x-4 rounded-xl p-4 bg-black">
            <Image
              src={post.authorImage}
              alt={post.author}
              width={200}
              height={200}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div className="text-sm space-y-2">
              <p className="flex flex-row items-center text-white not-italic">
                <FaUser className="mr-2" />
                {post.author}
              </p>
              <p className="flex flex-row items-center text-white not-italic">
                <FaCalendar className="mr-2" />
                {format(new Date(post.createDate), "yyyy/MM/dd")}
              </p>
            </div>
          </address>

          <div className="mt-4">
            <ShareOptions />
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <h2 className="text-2xl font-bold">Recent Posts</h2>

        <RecentPosts />
      </div>
    </MainContainer>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  return {
    title: post.title,
    description: post.description || "Blog",
    keywords: post.keywords || "Blog",
    authors: [
      {
        name: post.author,
        url: "/about",
      },
    ],
    openGraph: {
      title: post.title,
      description: post.description || "Blog",
      images: [
        {
          url: post.image || "/images/placeholder/placeholder-image.jpg",
          width: 800,
          height: 600,
          alt: post.title,
        },
        {
          url: post.authorImage || "/images/placeholder/placeholder-avatar.jpg",
          width: 96,
          height: 96,
          alt: `${post.author}'s avatar`,
        },
      ],
    },
  };
}

export default BlogPostPage;
