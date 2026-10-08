import Link from "next/link";

import { FaThumbtack } from "react-icons/fa";

import type { Post } from "@/lib/posts";

import CarousalContainer from "../container/CarousalContainer";
import PostItem from "./PostItem";

interface FeaturedPostsProps {
  posts: Post[];
  className?: string;
  eagerFirstImage?: boolean;
}

function FeaturedPosts({
  posts,
  className,
  eagerFirstImage = false,
}: FeaturedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <CarousalContainer autoScroll autoScrollInterval={5000}>
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
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
              eager={eagerFirstImage && index === 0}
            />
          </Link>
        ))}
      </CarousalContainer>
    </div>
  );
}

export function FeaturedPostsHeader() {
  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        <FaThumbtack className="h-6 w-6 text-accent" />
        <h2>Featured Posts</h2>
      </div>
    </div>
  );
}

export default FeaturedPosts;
