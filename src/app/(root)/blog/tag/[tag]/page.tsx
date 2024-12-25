import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser } from "react-icons/fa6";
import { format } from "date-fns";

import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostItemAlt from "@/components/post/PostItemAlt";

async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const tag = (await params).tag;
  const response = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        limit: 4,
        tags: [tag],
      }),
    }
  );

  const posts = response?.posts || [];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tag", href: "/blog/tag" },
    { label: tag, href: `/blog/tag/${tag}` },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col space-y-4 mt-8">
        <h1>
          Tag:{" "}
          <span className="text-suzuha-teal-500">
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>
        </h1>
        <p className="text-lg text-neutral-400">
          Explore articles tagged with{" "}
          <span className="text-suzuha-teal-500">
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>{" "}
          on this website.
        </p>
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post, index) => (
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
      </section>
    </MainContainer>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const tag = (await params).tag;

  return {
    title: `Articles tagged with ${tag} on Pavarit Wiriyakunakorn's website`,
    description: `Explore articles tagged with ${tag} on Pavarit Wiriyakunakorn's website.`,
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
