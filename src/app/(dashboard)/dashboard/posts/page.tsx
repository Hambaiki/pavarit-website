"use client";

import { Suspense, useEffect } from "react";
import { useState } from "react";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MainContainer from "@/components/container/MainContainer";
import Paginator from "@/components/Paginator";
import Loading from "@/components/navigation/Loading";
import PostItem from "@/components/dashboard/PostItem";

import { Post } from "@/types/post";
import { PostData } from "@/types/api/post";
import SearchBar from "@/components/post/SearchBar";
import Button from "@/components/Button";
import { FaArrowRight, FaPlus } from "react-icons/fa6";

function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const perPage = 8;

  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";

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
        per_page: perPage,
      }),
    });

    const data = await response.json();

    const maxPage = Math.ceil(data.total / perPage);
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

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Posts", href: "/dashboard/posts" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Manage Posts</h1>
          <p className="text-neutral-300">
            Manage your posts and their content.
          </p>
        </div>
      </header>

      <div className="mt-8">
        <SearchBar />
      </div>

      {isLoadingPosts ? (
        <Loading />
      ) : (
        <Suspense>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-2xl font-bold">All Posts</h2>
            <Button
              href="/dashboard/posts/create"
              variant="secondary"
              className="flex items-center px-4 py-2 h-full rounded-lg"
            >
              <span className="hidden mr-0 md:block md:mr-2">Create Post</span>
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
                views={post.views}
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
    </MainContainer>
  );
}

export default PostsPage;
