"use client";

import { Suspense, useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { PostMetadata } from "@/types/post";

import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostEditor from "@/components/post/editor/PostEditor";
import Loading from "@/components/navigation/Loading";
import GeneralModal from "@/components/common/GeneralModal";

function CreatePage({ searchParams }: { searchParams: { id: string } }) {
  if (!searchParams.id) {
    return notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Posts", href: "/dashboard/posts" },
    { label: "Edit", href: "/dashboard/posts/edit" },
  ];

  return (
    <>
      <MainContainer>
        <header className="flex flex-col">
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="space-y-4 mt-8">
            <h1 className="text-4xl font-bold">Edit Post</h1>
            <p className="text-neutral-300">
              Edit post information and content.
            </p>
          </div>
        </header>

        <Suspense fallback={<Loading />}>
          <Editor postId={searchParams.id} />
        </Suspense>
      </MainContainer>
    </>
  );
}

function Editor({ postId }: { postId: string }) {
  const [postContent, setPostContent] = useState<string | undefined>(undefined);
  const [postMetadata, setPostMetadata] = useState<PostMetadata | undefined>(
    undefined
  );

  const [loadingPost, setLoadingPost] = useState(false);
  const [createPostError, setCreatePostError] = useState(false);
  const [createPostSuccess, setCreatePostSuccess] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  async function fetchPost(id: string) {
    setLoadingPost(true);

    try {
      const response = await fetch(`/api/v1/posts/search?id=${id}`);

      if (response.ok) {
        const data = await response.json();

        setPostMetadata({
          title: data.post.title,
          slug: data.post.slug,
          description: data.post.description,
          category: data.post.category,
          tags: data.post.tags.join(","),
          keywords: data.post.keywords.join(","),
          author: data.post.author,
          image: data.post.image,
          altText: data.post.alt_text,
        });

        setPostContent(data.post.content);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoadingPost(false);
    }
  }

  async function updatePost({
    metadata,
    content,
  }: {
    metadata: PostMetadata;
    content: string;
  }) {
    try {
      const processedSlug = metadata.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/--+/g, "-");

      const response = await fetch("/api/v1/posts/update", {
        method: "POST",
        body: JSON.stringify({
          id: postId,
          title: metadata.title,
          slug: processedSlug,
          description: metadata.description,
          category: metadata.category,
          tags: metadata.tags
            ? metadata.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "")
            : [],
          keywords: metadata.keywords
            ? metadata.keywords
                .split(",")
                .map((keyword) => keyword.trim())
                .filter((keyword) => keyword !== "")
            : [],
          author: metadata.author,
          image: metadata.image,
          alt_text: metadata.altText,
          content: content,
        }),
      });

      if (response.ok) {
        setCreatePostSuccess(true);
      } else {
        setCreatePostError(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setCreatePostError(true);
    }
  }

  return (
    <>
      {loadingPost ? (
        <Loading />
      ) : (
        <div className="mt-8">
          <PostEditor
            postMetadata={postMetadata}
            postContent={postContent}
            onSubmit={updatePost}
          />
        </div>
      )}

      <GeneralModal
        visible={createPostSuccess}
        title="Post Updated"
        message="Your post has been updated successfully."
        primaryButtonText="Understood"
        onClickPrimary={() => setCreatePostSuccess(false)}
      />

      <GeneralModal
        visible={createPostError}
        title="Error"
        message="There was an error updating your post."
        primaryButtonText="Understood"
        onClickPrimary={() => setCreatePostError(false)}
      />
    </>
  );
}

export default CreatePage;
