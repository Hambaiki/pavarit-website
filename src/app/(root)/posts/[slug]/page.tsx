import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import * as changeCase from "change-case";

import { getPostBySlug, getPosts, renderPostContent } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostRenderer from "@/components/post/PostRenderer";
import ShareOptions from "@/components/post/ShareOptions";
import PostItemAlt from "@/components/post/PostItemAlt";
import AuthorItem from "@/components/post/AuthorItem";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderPostContent(post.content);
  const relatedPosts = (await getPosts())
    .filter(
      (candidate) =>
        candidate.slug !== post.slug &&
        candidate.tags.some(
          (tag) => post.tags.includes(tag) && !tag.startsWith("_"),
        ),
    )
    .slice(0, 3);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: post.title, href: `/posts/${post.slug}` },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>{post.title}</h1>
          <ul className="flex flex-row flex-wrap gap-2">
            {post.tags
              .filter((tag) => !tag.startsWith("_"))
              .map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/posts/tag/${tag}`}
                    className="block px-3 py-1 rounded-full bg-surface-raised hover:bg-surface-muted transition-colors"
                  >
                    {changeCase.capitalCase(tag)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row space-y-8 space-x-0 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 mt-8 lg:my-8">
          <div className="mb-8">
            {post.image && (
              <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96 mb-6 rounded-xl overflow-hidden bg-surface isolate">
                <Image
                  src={post.image}
                  alt=""
                  width={1000}
                  height={1000}
                  aria-hidden="true"
                  sizes="100vw"
                  loading="eager"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-70"
                />
                <Image
                  src={post.image}
                  alt={post.altText}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  loading="eager"
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
            )}

            <div className="block lg:hidden">
              <AuthorItem author={post.author} createdAt={post.created_at} />
            </div>
          </div>

          <PostRenderer contentHtml={contentHtml} />
        </div>

        <div className="lg:sticky lg:top-20 lg:h-full lg:w-80 lg:py-8">
          <div className="hidden lg:block mb-4">
            <AuthorItem author={post.author} createdAt={post.created_at} />
          </div>
          <ShareOptions />
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="space-y-4 mt-8">
          <h2>Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link href={`/posts/${relatedPost.slug}`} key={relatedPost.slug}>
                <PostItemAlt
                  title={relatedPost.title}
                  image={relatedPost.image}
                  author={relatedPost.author}
                  createDate={relatedPost.created_at}
                  tags={relatedPost.tags}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </MainContainer>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found - Pavarit's Website" };
  }

  const canonical = `/posts/${post.slug}`;

  return {
    title: `${post.title} - Pavarit's Website`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author, url: "/about" }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      siteName: "Pavarit's Website",
      url: canonical,
      images: post.image
        ? [
            {
              url: post.image,
              width: 800,
              height: 600,
              alt: post.altText,
            },
          ]
        : [],
    },
    robots: "index, follow",
    alternates: { canonical },
  };
}

export default BlogPostPage;
