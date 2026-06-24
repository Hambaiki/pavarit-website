"use client";

import { Suspense, use, useEffect, useState } from "react";

import { notFound } from "next/navigation";

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
import { serverGetPostById, serverUpdatePost } from "@/features/blog/actions";
import PostEditor from "@/features/blog/components/post/editor/PostEditor";
import { slugify } from "@/lib/string";
import { PostMetadata } from "@/types/posts";

function EditPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = use(searchParams);

  if (!id) {
    return notFound();
  }

  const [postContent, setPostContent] = useState<string>();
  const [postMetadata, setPostMetadata] = useState<PostMetadata>();

  const [loadingPost, setLoadingPost] = useState(false);
  const [editPostError, setEditPostError] = useState(false);
  const [editPostSuccess, setEditPostSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  async function fetchPost(postId: string) {
    setLoadingPost(true);

    try {
      const result = await serverGetPostById(postId);

      if (result.success && result.post) {
        setPostMetadata({
          title: result.post.title,
          slug: result.post.slug,
          description: result.post.description,
          category: result.post.category,
          tags: result.post.tags.join(","),
          keywords: result.post.keywords.join(","),
          author: result.post.author,
          image: result.post.image,
          altText: result.post.altText,
        });

        setPostContent(result.post.content);
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
      const processedSlug = slugify(metadata.slug);

      const result = await serverUpdatePost(id, {
        title: metadata.title,
        slug: processedSlug,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags
          ? metadata.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
              .map((tag) => slugify(tag))
          : [],
        keywords: metadata.keywords
          ? metadata.keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword !== "")
              .map((keyword) => slugify(keyword))
          : [],
        author: metadata.author,
        image: metadata.image,
        altText: metadata.altText,
        content: content,
      });

      if (result.success) {
        setEditPostSuccess(true);
      } else {
        setEditPostError(true);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setEditPostError(true);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] md:h-dvh overflow-hidden">
      <div className="flex-1 min-h-0">
        <Suspense fallback={<Loading />}>
          <>
            {loadingPost ? (
              <Loading />
            ) : (
              <PostEditor
                postMetadata={postMetadata}
                postContent={postContent}
                onSubmit={updatePost}
              />
            )}

            <Modal
              open={editPostSuccess}
              onOpenChange={(open) => {
                if (!open) setEditPostSuccess(false);
              }}
            >
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Post Updated</ModalTitle>
                  <ModalDescription>
                    Your post has been updated successfully.
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
              open={editPostError}
              onOpenChange={(open) => {
                if (!open) setEditPostError(false);
              }}
            >
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Error</ModalTitle>
                  <ModalDescription>
                    There was an error updating your post.
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
        </Suspense>
      </div>
    </div>
  );
}

export default EditPage;
