"use client";

import { Suspense, use, useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa6";

import Button from "@/components/Button";
import Paginator from "@/components/Paginator";
import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import PostItem from "@/components/dashboard/PostItem";
import Loading from "@/components/navigation/Loading";
import SearchBar from "@/components/post/SearchBar";
import { PostData } from "@/types/api/post";
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

  async function initPost(page: number, search: string) {
    setIsLoadingPosts(true);

    fetchPosts(page, search)
      .then((data) => {
        setPosts(data.posts);
        setMaxPage(data.maxPage);
      })
      .finally(() => {
        setIsLoadingPosts(false);
      });
  }

  async function fetchPosts(page: number, search: string) {
    const response = await fetch(`/api/v1/posts/search`, {
      method: "POST",
      body: JSON.stringify({
        search: search,
        page: page,
        limit: limit,
      }),
    });

    const data = await response.json();

    const maxPage = Math.ceil(data.total / limit);
    const posts = data.posts;

    return {
      maxPage,
      posts: posts.map((post: PostData) => ({
        ...post,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      })),
    };
  }

  async function deletePost(id: number) {
    try {
      const response = await fetch(`/api/v1/posts/delete`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
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
