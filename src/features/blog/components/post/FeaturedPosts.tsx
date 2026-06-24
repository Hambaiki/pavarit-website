import Link from "next/link";

import { FaThumbtack } from "react-icons/fa";

import { serverGetPosts } from "@/features/blog/actions";
import { cn } from "@/lib/cn";

import CarousalContainer from "../../../../components/container/CarousalContainer";
import NoPost from "./NoPost";
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

  const featuredPostsResponse = await serverGetPosts({
    page: 1,
    limit: count,
    tags: ["_featured"],
  });

  const featuredPosts = featuredPostsResponse?.posts || [];

  return (
    <div className={cn(className)}>
      {featuredPosts.length > 0 ? (
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
                createDate={post.createdAt}
                tags={post.tags}
                description={post.description}
                className="h-full md:h-80"
              />
            </Link>
          ))}
        </CarousalContainer>
      ) : (
        <NoPost />
      )}
    </div>
  );
}

export function FeaturedPostsHeader() {
  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        <FaThumbtack className="h-6 w-6 text-primary-500" />
        <h2>Featured Posts</h2>
      </div>
    </div>
  );
}

export function FeaturedPostsSkeleton({
  className,
  count = 4,
}: FeaturedPostsProps) {
  return (
    <div className={cn(`space-y-6`, className)}>
      <CarousalContainer>
        {[...Array(count)].map((_, index) => (
          <PostItem className="h-full md:h-80" loading key={index} />
        ))}
      </CarousalContainer>
    </div>
  );
}

export default FeaturedPosts;
