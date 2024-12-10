import Image from "next/image";
import html from "remark-html";
import { remark } from "remark";
import { format } from "date-fns";
import { Metadata } from "next";

import { getPostBySlug, getRecentPosts } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostRenderer from "@/components/post/PostRenderer";
import ShareOptions from "@/components/post/ShareOptions";
import Link from "next/link";

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
    openGraph: {
      title: post.title,
      description: post.description || "Blog",
      images: [post.image || "/images/placeholder/image-placeholder.jpg"],
    },
  };
}

async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);
  const recentPosts = await getRecentPosts();

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

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
          <ul className="flex flex-row space-x-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="px-3 py-1 rounded-full 
                text-sm text-neutral-300 bg-neutral-900"
              >
                {tag}
              </li>
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
              width={512}
              height={512}
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
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div className="text-sm space-y-2">
              <p className="text-white not-italic">
                <strong>Author:</strong>&nbsp;{post.author}
              </p>
              <p className="text-white not-italic">
                <strong>Published:</strong>&nbsp;
                {format(new Date(post.date), "yyyy/MM/dd")}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentPosts.map((recentPost) => (
            <Link
              key={recentPost.slug}
              href={`/blog/${recentPost.slug}`}
              className="flex flex-col space-y-2 p-4 rounded-xl 
            bg-neutral-900 hover:bg-neutral-950 transition-colors"
            >
              <h2 className="text-xl font-semibold">{recentPost.title}</h2>
              <p className="text-base text-neutral-300">{recentPost.author}</p>

              <ul className="flex flex-row flex-wrap space-x-2">
                {recentPost.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* <div className="p-4 bg-neutral-800 rounded-lg">
                <p className="text-neutral-300">{recentPost.description}</p>
              </div> */}
            </Link>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}

export default BlogPostPage;
