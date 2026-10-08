import Link from "next/link";

import type { Post } from "@/lib/posts";

import PostItemAlt from "./PostItemAlt";

function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((recentPost) => (
        <Link key={recentPost.slug} href={`/posts/${recentPost.slug}`}>
          <PostItemAlt
            image={recentPost.image}
            title={recentPost.title}
            author={recentPost.author}
            createDate={recentPost.created_at}
            tags={recentPost.tags}
          />
        </Link>
      ))}
    </div>
  );
}

export default RecentPosts;
