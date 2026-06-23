import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import * as changeCase from "change-case";

import { Section } from "@/components/content";
import Header from "@/components/content/Header";
import AuthorItem from "@/components/post/AuthorItem";
import PostItemAlt from "@/components/post/PostItemAlt";
import PostRenderer from "@/components/post/PostRenderer";
import PostTopicList from "@/components/post/PostTopicList";
import ShareOptions from "@/components/post/ShareOptions";
import { fetchFromApi } from "@/lib/api";
import {
  GetPostMetadataResponse,
  GetPostResponse,
  SearchPostResponse,
} from "@/types/api/post";

async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch the post data using the reusable function
  const postData = await fetchFromApi<GetPostResponse>(
    `/api/v1/posts/search/${slug}`,
    "GET"
  );

  const relatedPostData = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search/`,
    "POST",
    {
      body: JSON.stringify({
        tags: postData?.post?.tags,
        page: 1,
        limit: 3,
      }),
    }
  );

  const post = postData?.post;

  if (!post) {
    return notFound();
  }

  const relatedPosts = relatedPostData?.posts.filter(
    (post) => post.id !== postData.post.id
  );

  const contentHtml = post.content || "";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <Header title={post.title} breadcrumbs={breadcrumbs}>
        <ul className="flex flex-row flex-wrap gap-2 mt-4">
          {post.tags
            .filter((tag) => !tag.includes("_"))
            .map((tag, index) => (
              <Link href={`/blog/tag/${tag}`} key={index}>
                <li
                  key={index}
                  className="px-3 py-1 rounded-full
                      bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  {changeCase.capitalCase(tag)}
                </li>
              </Link>
            ))}
        </ul>
      </Header>

      <Section className="flex flex-col lg:flex-row space-y-8 space-x-0 lg:space-y-0 lg:space-x-4">
        <div className="flex-1">
          <div className="mb-8">
            {post.image && (
              <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96 mb-6 rounded-xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain"
                />

                <Image
                  src={post.image}
                  alt={post.title}
                  width={1000}
                  height={1000}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full brightness-50 -z-10 blur object-cover"
                />
              </div>
            )}

            <div className="block lg:hidden">
              <AuthorItem author={post.author} createdAt={post.created_at} />

              <PostTopicList htmlContent={contentHtml} />
            </div>
          </div>

          <PostRenderer contentHtml={contentHtml} />
        </div>

        <aside>
          <div className="sticky top-8">
            <div className="hidden lg:block mb-4">
              <AuthorItem author={post.author} createdAt={post.created_at} />

              <PostTopicList htmlContent={contentHtml} />
            </div>

            <ShareOptions />
          </div>
        </aside>
      </Section>

      {relatedPosts && relatedPosts.length > 0 && (
        <Section className="space-y-4 mt-8">
          <h2>Related Posts</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={index}>
                <PostItemAlt
                  key={index}
                  title={post.title}
                  image={post.image}
                  author={post.author}
                  createDate={post.created_at}
                  tags={post.tags}
                />
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const response = await fetchFromApi<GetPostMetadataResponse>(
    `/api/v1/posts/metadata`,
    "POST",
    {
      body: JSON.stringify({ slug }),
    }
  );

  const metadata = response?.metadata;

  return {
    title: metadata?.title || "Blog - Pavarit's Website",
    description: metadata?.description || "Blog",
    keywords: metadata?.keywords || "Blog",
    authors: [
      {
        name: metadata?.author || "",
        url: "/about",
      },
    ],
    openGraph: {
      type: "article",
      title: metadata?.title || "Blog - Pavarit's Website",
      description: metadata?.description || "Blog",
      siteName: "Pavarit's Website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${metadata?.slug}`,
      images: [
        {
          url: metadata?.image || "",
          width: 800,
          height: 600,
          alt: metadata?.title || "Blog",
        },
      ],
    },
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${metadata?.slug}`,
    },
  };
}

export default BlogPostPage;
