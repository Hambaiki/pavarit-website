"use client";

import { Suspense, useState } from "react";

import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Loading from "@/components/navigation/Loading";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import PostEditor from "@/features/blog/components/post/editor/PostEditor";
import { createPost } from "@/features/blog/libs";
import { PostMetadata } from "@/types/posts";

function CreatePage() {
  const router = useRouter();

  const [createPostError, setCreatePostError] = useState<string>();
  const [createPostSuccess, setCreatePostSuccess] = useState<string>();

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
      <div className="flex flex-col h-[calc(100dvh-7rem)] md:h-dvh overflow-hidden">
        <div className="flex-1 min-h-0">
          <Suspense fallback={<Loading />}>
            <PostEditor
              onSubmit={handlePostCreation}
              onSuccess={handlePostCreationSuccess}
              onError={handlePostCreationError}
            />
          </Suspense>
        </div>
      </div>

      <Modal
        open={createPostSuccess !== undefined}
        onOpenChange={(open) => {
          if (!open) router.push(`/dashboard/posts`);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Post Created</ModalTitle>
            <ModalDescription>
              {createPostSuccess || "Post created successfully"}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="px-4 py-2 rounded-lg text-sm">
                Understood
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        open={createPostError !== undefined}
        onOpenChange={(open) => {
          if (!open) setCreatePostError(undefined);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Error</ModalTitle>
            <ModalDescription>
              {createPostError || "Error creating post"}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="px-4 py-2 rounded-lg text-sm">
                Understood
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePage;
