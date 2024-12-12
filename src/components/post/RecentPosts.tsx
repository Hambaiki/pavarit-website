import Link from "next/link";

import { getRecentPosts } from "@/lib/posts";

import PostItemAlt from "./PostItemAlt";

async function RecentPosts() {
  const posts = await getRecentPosts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((recentPost) => (
        <Link key={recentPost.slug} href={`/blog/${recentPost.slug}`}>
          <PostItemAlt
            image={recentPost.image}
            title={recentPost.title}
            author={recentPost.author}
            createDate={recentPost.createDate}
            tags={recentPost.tags.map((tag) => tag.name)}
          />
        </Link>
      ))}
    </div>
  );
}

export default RecentPosts;
