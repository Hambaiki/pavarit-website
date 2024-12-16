import Link from "next/link";
import { neon } from "@neondatabase/serverless";

import { FaList, FaThumbtack } from "react-icons/fa6";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";
import PostItem from "@/components/post/PostItem";
import CarousalContainer from "@/components/container/CarousalContainer";
import Button from "@/components/Button";
import { fetchFromApi } from "@/utils/api";
import { SearchPostResponse } from "@/types/api/post";

async function page() {
  const featuredPostsResponse = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        per_page: 4,
        tags: ["_featured"],
      }),
    }
  );

  const latestPostsResponse = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        per_page: 4,
      }),
    }
  );

  const featuredPosts = featuredPostsResponse?.posts || [];
  const latestPosts = latestPostsResponse?.posts || [];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  async function create(formData: FormData) {
    "use server";
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get("comment");
    // Insert the comment from the form into the Postgres database
    await sql("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  }

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-neutral-300">
            Here are some of my blogs. I write about my experiences and thoughts
            about technology, life, and other things.
          </p>
        </div>
      </header>

      {featuredPosts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center space-x-2">
            <FaThumbtack className="h-6 w-6 text-suzuha-teal-500" />
            <h2 className="text-2xl font-bold">Featured Posts</h2>
          </div>

          <div className="mt-6">
            <CarousalContainer autoScroll autoScrollInterval={5000}>
              {featuredPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="w-full h-full bg-green-500"
                >
                  <PostItem
                    image={post.image}
                    title={post.title}
                    author={post.author}
                    createDate={post.create_date}
                    tags={post.tags}
                    description={post.description}
                    className="h-full md:h-80"
                  />
                </Link>
              ))}
            </CarousalContainer>
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaList className="h-6 w-6 text-suzuha-teal-500" />
            <h2 className="text-2xl font-bold">Latest Posts</h2>
          </div>

          <div className="flex justify-center">
            <Button
              href="/blog/all"
              variant="secondary"
              className="px-3 py-2 rounded-full text-sm"
            >
              View More Posts
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-6">
          {latestPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <PostItem
                image={post.image}
                title={post.title}
                author={post.author}
                createDate={post.create_date}
                tags={post.tags}
                description={post.description}
                className="md:h-80"
              />
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 p-4 bg-neutral-950 rounded-xl">
          <p className="text-center md:text-left text-neutral-300">
            Interested in my other posts?
            <strong> Check out other posts here!</strong>
          </p>
          <Button
            href="/blog/all"
            variant="primary"
            className="px-4 py-2 rounded-full"
          >
            View More Posts
          </Button>
        </div>
      </div>
    </MainContainer>
  );
}

export async function generateMetadata() {
  const postData = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        per_page: 4,
        tags: ["_featured"],
      }),
    }
  );
  const posts = postData?.posts || [];

  return {
    title: `Discover variety of articles on Pavarit Wiriyakunakorn's website`,
    description: `Explore article about various topics such as ${posts
      .map((post) => post.title)
      .slice(0, 2)
      .join(", ")}, and more.`,
    keywords: [posts.flatMap((post) => post.keywords)],
    robots: "index, follow",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default page;
