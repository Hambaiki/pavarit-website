import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  GetPostMetadataResponse,
  GetPostResponse,
  SearchPostResponse,
} from "@/types/api/post";
import { fetchFromApi } from "@/lib/api";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostRenderer from "@/components/post/PostRenderer";
import ShareOptions from "@/components/post/ShareOptions";
import PostItemAlt from "@/components/post/PostItemAlt";
import PostTopicList from "@/components/post/PostTopicList";
import CommentSection from "@/components/post/comment/CommentSection";
import AuthorItem from "@/components/post/AuthorItem";

async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = await params.slug;

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
  } else {
    await fetchFromApi(`/api/v1/posts/analytics/views`, "POST", {
      body: JSON.stringify({ id: post.id }),
    });
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
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>{post.title}</h1>
          <ul className="flex flex-row flex-wrap space-x-2">
            {post.tags
              .filter((tag) => !tag.includes("_"))
              .map((tag, index) => (
                <Link href={`/blog/tag/${tag}`} key={index}>
                  <li
                    key={index}
                    className="px-3 py-1 rounded-full 
                      bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {tag}
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row space-y-8 space-x-0 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 mt-8 lg:my-8">
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
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full blur-sm -z-10"
                />
              </div>
            )}

            <div className="block lg:hidden">
              <AuthorItem author={post.author} createdAt={post.created_at} />

              <PostTopicList htmlContent={contentHtml} />
            </div>
          </div>

          <PostRenderer contentHtml={contentHtml} />

          <div className="mt-8">
            <CommentSection postId={post.id} />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-full lg:w-80 lg:py-8">
          <div className="hidden lg:block mb-4">
            <AuthorItem author={post.author} createdAt={post.created_at} />

            <PostTopicList htmlContent={contentHtml} />
          </div>

          <ShareOptions />
        </div>
      </div>

      {relatedPosts && relatedPosts.length > 0 && (
        <div className="space-y-4 mt-8">
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
        </div>
      )}
    </MainContainer>
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
    title: metadata?.title || "Blog",
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
      title: metadata?.title || "Blog",
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
