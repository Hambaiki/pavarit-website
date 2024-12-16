"use client";

import { useState } from "react";

import { PostMetadata } from "@/types/post";

import Loading from "../navigation/Loading";
import TextInput from "../form/TextInput";
import Button from "../Button";

function TestFetch() {
  const [postId, setPostId] = useState<string | undefined>(undefined);

  const [postContent, setPostContent] = useState<string | undefined>(undefined);
  const [postMetadata, setPostMetadata] = useState<PostMetadata | undefined>(
    undefined
  );

  const [loadingPost, setLoadingPost] = useState(false);

  async function fetchPost(id: string) {
    setLoadingPost(true);

    try {
      const response = await fetch(`/api/v1/posts/search?id=${id}`);

      if (response.ok) {
        const data = await response.json();

        console.log(data);

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (postId) {
      fetchPost(postId);
    }
  }

  if (loadingPost) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Development</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          label="Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
        />
        <Button type="submit" className="rounded-lg px-4 py-2">
          Fetch
        </Button>
      </form>

      {postMetadata && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Post Metadata</h2>
          <pre
            className="p-4 mt-4 rounded-xl whitespace-pre-wrap break-all
          text-neutral-300 bg-neutral-900"
          >
            {JSON.stringify(postMetadata, null, 2)}
          </pre>
        </div>
      )}

      {postContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Post Content</h2>
          <pre
            className="p-4 mt-4 rounded-xl whitespace-pre-wrap break-all
          text-neutral-300 bg-neutral-900"
          >
            {JSON.stringify(postContent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TestFetch;
