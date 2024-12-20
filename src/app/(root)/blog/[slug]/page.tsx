import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  GetPostMetadataResponse,
  GetPostResponse,
  SearchPostResponse,
} from "@/types/api/post";
import { fetchFromApi } from "@/lib/api";

import { FaCalendar, FaUser } from "react-icons/fa";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostRenderer from "@/components/post/PostRenderer";
import ShareOptions from "@/components/post/ShareOptions";
import PostItemAlt from "@/components/post/PostItemAlt";
import PostTopicList from "@/components/post/PostTopicList";

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
          <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          <ul className="flex flex-row flex-wrap space-x-2">
            {post.tags
              .filter((tag) => !tag.includes("_"))
              .map((tag, index) => (
                <Link href={`/blog/tag/${tag}`} key={index}>
                  <li
                    key={index}
                    className="px-3 py-1 rounded-full 
                    text-sm text-neutral-300 bg-neutral-700 hover:bg-neutral-900 transition-colors"
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
              <address className="flex flex-row items-center space-x-4 rounded-xl p-4 bg-black mb-4">
                {/* <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={200}
                  height={200}
                  className="w-16 h-16 rounded-full object-cover"
                /> */}

                <div className="text-sm space-y-2">
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaUser className="mr-2" />
                    {post.author}
                  </p>
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaCalendar className="mr-2" />
                    {format(new Date(post.created_at), "yyyy/MM/dd")}
                  </p>
                </div>
              </address>

              <PostTopicList htmlContent={contentHtml} />
            </div>
          </div>

          <PostRenderer contentHtml={contentHtml} />
        </div>

        <div className="lg:sticky lg:top-24 lg:h-full lg:w-80 lg:py-8">
          <div className="hidden lg:block mb-4">
            <address className="flex flex-row items-center space-x-4 rounded-xl p-4 bg-black mb-4">
              {/* <Image
              src={post.authorImage}
              alt={post.author}
              width={200}
              height={200}
              className="w-16 h-16 rounded-full object-cover"
            /> */}

              <div className="text-sm space-y-2">
                <p className="flex flex-row items-center text-white not-italic">
                  <FaUser className="mr-2" />
                  {post.author}
                </p>
                <p className="flex flex-row items-center text-white not-italic">
                  <FaCalendar className="mr-2" />
                  {format(new Date(post.created_at), "yyyy/MM/dd")}
                </p>
              </div>
            </address>

            <PostTopicList htmlContent={contentHtml} />
          </div>

          <ShareOptions />
        </div>
      </div>

      {relatedPosts && relatedPosts.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Related Posts</h2>

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
