import Link from "next/link";

import { FaList } from "react-icons/fa";

import type { Post } from "@/lib/posts";

import Button from "../Button";
import PostItemAlt from "./PostItemAlt";

interface LatestPostsProps {
  posts: Post[];
  className?: string;
}

function LatestPosts({ posts, className }: LatestPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <PostItemAlt
              image={post.image}
              title={post.title}
              author={post.author}
              createDate={post.created_at}
              tags={post.tags}
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LatestPostsHeader() {
  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        <FaList className="h-6 w-6 text-accent" />
        <h2>Latest Posts</h2>
      </div>

      <div className="flex justify-center">
        <Button
          href="/posts/all"
          variant="secondary"
          className="px-3 py-2 rounded-full text-sm"
        >
          View More Posts
        </Button>
      </div>
    </div>
  );
}

export default LatestPosts;
