"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

import { PostMetadata } from "@/types/post";
import { createPost } from "@/lib/api/posts";

import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostEditor from "@/components/post/editor/PostEditor";
import GeneralModal from "@/components/common/GeneralModal";

function CreatePage() {
  const router = useRouter();

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Posts", href: "/dashboard/posts" },
    { label: "Create", href: "/dashboard/posts/create" },
  ];

  const [createPostError, setCreatePostError] = useState<string | undefined>(
    undefined
  );
  const [createPostSuccess, setCreatePostSuccess] = useState<
    string | undefined
  >(undefined);

  function handlePostCreationSuccess(message?: string) {
    setCreatePostSuccess(message || "Post created successfully");
  }

  function handlePostCreationError(message?: string) {
    setCreatePostError(message || "Error creating post");
  }

  function handlePostCreation({
    metadata,
    content,
  }: {
    metadata: PostMetadata;
    content: string;
  }) {
    createPost({
      metadata,
      content,
      onError: handlePostCreationError,
      onSuccess: handlePostCreationSuccess,
    });
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
              onSubmit={handlePostCreation}
              onSuccess={handlePostCreationSuccess}
              onError={handlePostCreationError}
            />
          </div>
        </Suspense>
      </MainContainer>

      <GeneralModal
        visible={createPostSuccess !== undefined}
        title="Post Created"
        message={createPostSuccess || "Post created successfully"}
        primaryButtonText="Understood"
        onClickPrimary={() => router.push(`/dashboard/posts`)}
      />

      <GeneralModal
        visible={createPostError !== undefined}
        title="Error"
        message={createPostError || "Error creating post"}
        primaryButtonText="Understood"
        onClickPrimary={() => setCreatePostError(undefined)}
      />
    </>
  );
}

export default CreatePage;
