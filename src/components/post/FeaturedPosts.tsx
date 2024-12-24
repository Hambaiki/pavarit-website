import Link from "next/link";

import { FaThumbtack } from "react-icons/fa";

import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse } from "@/types/api/post";

import CarousalContainer from "../container/CarousalContainer";
import PostItem from "./PostItem";

interface FeaturedPostsProps {
  className?: string;
  delay?: number;
  count?: number;
}

async function FeaturedPosts({
  delay = 6000,
  className,
  count = 4,
}: FeaturedPostsProps) {
  // await new Promise((resolve) => setTimeout(resolve, delay)); // Delay for testing

  const featuredPostsResponse = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search`,
    "POST",
    {
      body: JSON.stringify({
        page: 1,
        limit: count,
        tags: ["_featured"],
      }),
    }
  );

  const featuredPosts = featuredPostsResponse?.posts || [];

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <CarousalContainer autoScroll autoScrollInterval={5000}>
        {featuredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="w-full h-full"
          >
            <PostItem
              image={post.image}
              title={post.title}
              author={post.author}
              createDate={post.created_at}
              tags={post.tags}
              description={post.description}
              className="h-full md:h-80"
            />
          </Link>
        ))}
      </CarousalContainer>
    </div>
  );
}

export function FeaturedPostsHeader() {
  return (
    <div className="flex items-center space-x-2">
      <FaThumbtack className="h-6 w-6 text-suzuha-teal-500" />
      <h2>Featured Posts</h2>
    </div>
  );
}

export function FeaturedPostsSkeleton({
  className,
  count = 4,
}: FeaturedPostsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <CarousalContainer>
        {[...Array(count)].map((_, index) => (
          <PostItem className="h-full md:h-80" loading key={index} />
        ))}
      </CarousalContainer>
    </div>
  );
}

export default FeaturedPosts;
