import Link from "next/link";

import { serverGetPosts } from "@/features/blog/actions";

import PostItemAlt from "./PostItemAlt";

async function RecentPosts() {
  const response = await serverGetPosts({
    page: 1,
    limit: 4,
  });

  const posts = response?.posts || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((recentPost: any) => (
        <Link key={recentPost.slug} href={`/blog/${recentPost.slug}`}>
          <PostItemAlt
            image={recentPost.image}
            title={recentPost.title}
            author={recentPost.author}
            createDate={recentPost.createdAt}
            tags={recentPost.tags}
          />
        </Link>
      ))}
    </div>
  );
}

export default RecentPosts;
