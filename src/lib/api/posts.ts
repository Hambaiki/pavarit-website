import { PostMetadata } from "@/types/posts";

export async function createPost({
  metadata,
  content,
  onError,
  onSuccess,
}: {
  metadata: PostMetadata;
  content: string;
  onError?: (message?: string) => void;
  onSuccess?: () => void;
}) {
  try {
    const processedSlug = metadata.slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/--+/g, "-");

    const slugUnique = await fetch("/api/v1/posts/create/check-slug-unique", {
      method: "POST",
      body: JSON.stringify({ slug: processedSlug }),
    });

    const data = await slugUnique.json();

    if (!data.unique) {
      onError?.("Slug is not unique");
      return;
    }

    const processedTags = metadata.tags
      ? metadata.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    const processedKeywords = metadata.keywords
      ? metadata.keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword !== "")
      : [];

    const response = await fetch("/api/v1/posts/create", {
      method: "POST",
      body: JSON.stringify({
        title: metadata.title,
        slug: processedSlug,
        description: metadata.description,
        category: metadata.category,
        tags: processedTags,
        keywords: processedKeywords,
        author: metadata.author,
        image: metadata.image,
        alt_text: metadata.altText,
        content: content,
      }),
    });

    if (response.ok) {
      onSuccess?.();
    } else {
      onError?.("Failed to create post");
    }
  } catch (error) {
    console.error("Error creating post:", error);
    onError?.("Failed to create post");
  }
}
