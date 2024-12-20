import Link from "next/link";

import { PostData, SearchPostResponse } from "@/types/api/post";
import { fetchFromApi } from "@/lib/api";

import PostItemAlt from "./PostItemAlt";

async function RecentPosts() {
  const response = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/search/`,
    "POST",
    {
      body: JSON.stringify({ page: 1, limit: 4 }),
    }
  );

  const posts: PostData[] = response?.posts || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {posts.map((recentPost) => (
        <Link key={recentPost.slug} href={`/blog/${recentPost.slug}`}>
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
