import Link from "next/link";

import { FaList } from "react-icons/fa";

import { fetchFromApi } from "@/utils/api";
import { SearchPostResponse } from "@/types/api/post";

import PostItem from "./PostItem";
import Button from "../Button";

interface LatestPostsProps {
  delay?: number;
  className?: string;
  count?: number;
}

async function LatestPosts({
  delay = 6000,
  className,
  count = 4,
}: LatestPostsProps) {
  await new Promise((resolve) => setTimeout(resolve, delay)); // Delay for testing

  const latestPostsResponse = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        per_page: count,
      }),
    }
  );

  const latestPosts = latestPostsResponse?.posts || [];

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <LatestPostsHeader />

      <div className="flex flex-col space-y-4 mt-6">
        {latestPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <PostItem
              image={post.image}
              title={post.title}
              author={post.author}
              createDate={post.created_at}
              tags={post.tags}
              description={post.description}
              className="md:h-80"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function LatestPostsHeader() {
  return (
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
  );
}

export function FallbackLatestPosts({
  className,
  count = 4,
}: LatestPostsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <LatestPostsHeader />

      <div className="flex flex-col space-y-4 mt-6">
        {[...Array(count)].map((_, index) => (
          <PostItem className="h-full md:h-80" loading key={index} />
        ))}
      </div>
    </div>
  );
}

export default LatestPosts;
