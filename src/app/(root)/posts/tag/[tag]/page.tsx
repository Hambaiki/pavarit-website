import Link from "next/link";
import { notFound } from "next/navigation";

import * as changeCase from "change-case";

import { filterPosts, getPostTags, getPosts } from "@/lib/posts";

import { FaBookOpen } from "react-icons/fa6";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostItemAlt from "@/components/post/PostItemAlt";

export async function generateStaticParams() {
  const tags = (await getPostTags()).filter((tag) => !tag.startsWith("_"));
  return tags.map((tag) => ({ tag }));
}

async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const availableTags = await getPostTags();

  if (!availableTags.includes(tag) || tag.startsWith("_")) {
    notFound();
  }

  const tagCapitalized = changeCase.capitalCase(tag);
  const posts = filterPosts(await getPosts(), { tags: [tag] });
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: "Tags", href: "/posts/tag" },
    { label: tagCapitalized, href: `/posts/tag/${tag}` },
  ];

  return (
    <MainContainer>
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="flex flex-col space-y-4 mt-8">
          <h1>
            Tag:&nbsp;
            <span className="text-accent">{tagCapitalized}</span>
          </h1>
          <p className="text-lg text-content-secondary">
            Explore posts tagged with&nbsp;
            <span className="text-accent">{tagCapitalized}</span>
            &nbsp;on this website.
          </p>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4">All Posts</h2>

        {posts.length === 0 && (
          <div className="flex flex-col justify-center items-center h-[20rem]">
            <FaBookOpen className="text-content-muted text-5xl mb-4" />
            <p className="text-center text-xl text-content-muted">
              No posts found.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post, index) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <PostItemAlt
                title={post.title}
                image={post.image}
                author={post.author}
                createDate={post.created_at}
                tags={post.tags}
                eager={index === 0}
              />
            </Link>
          ))}
        </div>
      </section>
    </MainContainer>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const titleTag = changeCase.capitalCase(tag);

  return {
    title: `Posts tagged with ${titleTag} - Pavarit's Website`,
    description: `Explore posts tagged with ${titleTag} on Pavarit Wiriyakunakorn's website.`,
    keywords: [tag],
    authors: [{ name: "Pavarit (Guide) Wiriyakunakorn", url: "/about" }],
    robots: "index, follow",
    alternates: {
      canonical: `/posts/tag/${tag}`,
    },
  };
}

export default TagPage;
