"use client";

import { Suspense, use, useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa6";

import Button from "@/components/Button";
import Paginator from "@/components/Paginator";
import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import Loading from "@/components/navigation/Loading";
import { serverDeletePost, serverGetPosts } from "@/features/blog/actions";
import SearchBar from "@/features/blog/components/post/SearchBar";
import PostItem from "@/features/dashboard/components/PostItem";
import { Post } from "@/types/posts";

function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const limit = 8;
  const { page: pageParam, search: searchParam } = use(searchParams);

  const page = parseInt(pageParam || "1", 10);
  const search = searchParam || "";

  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    initPost(page, search);
  }, [page, search]);

  async function initPost(pageNum: number, searchStr: string) {
    setIsLoadingPosts(true);

    const data = await serverGetPosts({
      search: searchStr,
      page: pageNum,
      limit: limit,
    });

    if (data.success) {
      const maxPageNum = Math.ceil(data.total / limit);
      setPosts(data.posts as Post[]);
      setMaxPage(maxPageNum);
    } else {
      setPosts([]);
      setMaxPage(0);
    }

    setIsLoadingPosts(false);
  }

  async function deletePost(id: number) {
    try {
      const result = await serverDeletePost(String(id));
      if (result.success) {
        initPost(1, search);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header
        title="Manage Posts"
        description="Manage your posts and their content."
      />

      <Section>
        <SearchBar />

        {isLoadingPosts ? (
          <Loading />
        ) : (
          <Suspense>
            <div className="flex items-center justify-between mt-8">
              <h2>All Posts</h2>
              <Button
                href="/dashboard/posts/create"
                variant="secondary"
                className="flex items-center px-4 py-2 h-full rounded-lg"
              >
                <span className="hidden mr-0 md:block md:mr-2">
                  Create Post
                </span>
                <FaPlus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              {posts.map((post, index) => (
                <PostItem
                  key={index}
                  id={post.id}
                  image={post.image}
                  slug={post.slug}
                  title={post.title}
                  author={post.author}
                  createdAt={post.createdAt}
                  updatedAt={post.updatedAt}
                  tags={post.tags}
                  description={post.description}
                  onDelete={deletePost}
                />
              ))}
            </div>

            {maxPage > 1 && (
              <div className="mt-8">
                <Paginator currentPage={page} maxPage={maxPage} />
              </div>
            )}
          </Suspense>
        )}
      </Section>
    </>
  );
}

export default PostsPage;
