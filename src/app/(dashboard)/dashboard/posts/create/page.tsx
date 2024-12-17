"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

import { PostMetadata } from "@/types/post";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostEditor from "@/components/post/editor/PostEditor";
import GeneralModal from "@/components/common/GeneralModal";

function CreatePage() {
  const router = useRouter();

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Posts", href: "/dashboard/posts" },
    { label: "Create", href: "/dashboard/posts/create" },
  ];

  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [createPostError, setCreatePostError] = useState(false);
  const [createPostSuccess, setCreatePostSuccess] = useState(false);

  function handlePostCreationSuccess() {
    setCreatePostSuccess(true);
  }

  function handlePostCreationError() {
    setCreatePostError(true);
  }

  async function createPost({
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

      const response = await fetch("/api/v1/posts/create", {
        method: "POST",
        body: JSON.stringify({
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
        setSlug(processedSlug);
        handlePostCreationSuccess();
      } else {
        handlePostCreationError();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      handlePostCreationError();
    }
  }

  return (
    <>
      <MainContainer>
        <header className="flex flex-col">
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="space-y-4 mt-8">
            <h1 className="text-4xl font-bold">Create Post</h1>
            <p className="text-neutral-300">Create a new post.</p>
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="mt-8">
            <PostEditor
              onSubmit={createPost}
              onSuccess={handlePostCreationSuccess}
              onError={handlePostCreationError}
            />
          </div>
        </Suspense>
      </MainContainer>

      <GeneralModal
        visible={createPostSuccess}
        title="Post Created"
        message="Your post has been created successfully."
        primaryButtonText="Understood"
        onClickPrimary={() => router.push(`/blog/${slug}`)}
      />

      <GeneralModal
        visible={createPostError}
        title="Error"
        message="There was an error creating your post."
        primaryButtonText="Understood"
        onClickPrimary={() => setCreatePostError(false)}
      />
    </>
  );
}

export default CreatePage;
