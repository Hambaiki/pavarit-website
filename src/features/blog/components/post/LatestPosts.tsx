import Link from "next/link";

import { FaList } from "react-icons/fa";

import { serverGetPosts } from "@/features/blog/actions";
import { cn } from "@/lib/cn";

import Button from "../../../../components/Button";
import NoPost from "./NoPost";
import PostItem from "./PostItem";
import PostItemAlt from "./PostItemAlt";

interface LatestPostsProps {
  delay?: number;
  className?: string;
  count?: number;
}

async function LatestPosts({ className, count = 4 }: LatestPostsProps) {
  // await new Promise((resolve) => setTimeout(resolve, delay)); // Delay for testing

  const latestPostsResponse = await serverGetPosts({
    page: 1,
    limit: count,
  });

  const latestPosts = latestPostsResponse?.posts || [];

  return (
    <div className={cn(className)}>
      {latestPosts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {latestPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <PostItemAlt
                image={post.image}
                title={post.title}
                author={post.author}
                createDate={post.createdAt}
                tags={post.tags}
                // description={post.description}
                // className="h-full md:h-80"
              />
            </Link>
          ))}
        </div>
      ) : (
        <NoPost />
      )}
    </div>
  );
}

export function LatestPostsHeader() {
  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        <FaList className="h-6 w-6 text-primary-500" />
        <h2>Latest Posts</h2>
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

export function LatestPostsSkeleton({
  className,
  count = 4,
}: LatestPostsProps) {
  return (
    <div className={cn(`space-y-6`, className)}>
      <div className="flex flex-col space-y-4 mt-6">
        {[...Array(count)].map((_, index) => (
          <PostItem className="h-full md:h-80" loading key={index} />
        ))}
      </div>
    </div>
  );
}

export default LatestPosts;
