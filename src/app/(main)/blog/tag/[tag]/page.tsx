import Link from "next/link";

import * as changeCase from "change-case";
import { FaBookOpen } from "react-icons/fa6";

import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { serverGetPosts } from "@/features/blog/actions";
import PostItemAlt from "@/features/blog/components/post/PostItemAlt";

async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const tag = decodeURIComponent((await params).tag);
  const tagCapitalized = changeCase.capitalCase(tag);

  const response = await serverGetPosts({
    page: 1,
    limit: 4,
    tags: [tag],
  });

  const posts = response?.posts || [];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tag", href: "/blog/tag" },
    { label: tagCapitalized, href: `/blog/tag/${tag}` },
  ];

  return (
    <>
      <Header
        title={
          <>
            Tag:&nbsp;
            <span className="text-primary-500">{tagCapitalized}</span>
          </>
        }
        description={
          <>
            Explore posts tagged with&nbsp;
            <span className="text-primary-500">
              {changeCase.capitalCase(tag)}
            </span>
            &nbsp;on this website.
          </>
        }
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <h2 className="mb-4">All Posts</h2>

        {posts.length === 0 && (
          <div className="flex flex-col justify-center items-center h-80">
            <FaBookOpen className="text-neutral-500 text-5xl mb-4" />
            <p className="text-center text-xl text-neutral-500">
              No posts found.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post: any, index: number) => (
            <Link href={`/blog/${post.slug}`} key={index}>
              <PostItemAlt
                key={index}
                title={post.title}
                image={post.image}
                author={post.author}
                createDate={post.createdAt}
                tags={post.tags}
              />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const tag = (await params).tag;

  return {
    title: `Posts tagged with ${tag} on this website - Pavarit's Website`,
    description: `Explore posts tagged with ${tag} on Pavarit Wiriyakunakorn's website.`,
    keywords: `Tag: ${tag}`,
    authors: [
      {
        name: "Pavarit (Guide) Wiriyakunakorn",
        url: "/about",
      },
    ],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/tag/${tag}`,
    },
  };
}

export default TagPage;
