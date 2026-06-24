"use server";

import {
  checkSlugUnique,
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPostMetadata,
  getPostTags,
  getPostTotal,
  getPosts,
  updatePost,
} from "@/lib/db/posts";
import { uploadFileToR2 } from "@/lib/r2/r2client";

export async function serverGetAllPosts() {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

export async function serverGetPosts({
  search = "",
  tags = [],
  page = 1,
  limit = 10,
  sort = "MOST_RECENT",
}: {
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: "MOST_RECENT";
} = {}) {
  try {
    const posts = await getPosts({
      search,
      tags,
      page,
      limit,
      sort,
    });
    const total = await getPostTotal({ search, tags });

    return {
      success: true,
      page,
      limit,
      total,
      posts,
    };
  } catch (error) {
    console.error("Error getting posts:", error);
    return {
      success: false,
      page,
      limit,
      total: 0,
      posts: [],
    };
  }
}

export async function serverGetPostById(id: string) {
  try {
    const post = await getPostById(id);
    return {
      success: true,
      post,
    };
  } catch (error) {
    console.error("Error getting post by id:", error);
    return {
      success: false,
      post: null,
    };
  }
}

export async function serverGetPostBySlug(slug: string) {
  try {
    const post = await getPostBySlug(slug);
    return {
      success: true,
      post,
    };
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return {
      success: false,
      post: null,
    };
  }
}

export async function serverGetPostMetadata(slug: string) {
  try {
    const post = await getPostMetadata(slug);
    return {
      success: true,
      post,
    };
  } catch (error) {
    console.error("Error getting post metadata:", error);
    return {
      success: false,
      post: null,
    };
  }
}

export async function serverGetPostTags() {
  try {
    const tags = await getPostTags();
    return {
      success: true,
      tags,
    };
  } catch (error) {
    console.error("Error getting post tags:", error);
    return {
      success: false,
      tags: [],
    };
  }
}

export async function serverCheckSlugUnique(slug: string) {
  try {
    const unique = await checkSlugUnique(slug);
    return {
      success: true,
      unique,
    };
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return {
      success: false,
      unique: false,
    };
  }
}

export async function serverCreatePost({
  slug,
  title,
  description,
  category,
  tags,
  keywords,
  author,
  image,
  altText,
  content,
}: {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  image: string;
  altText: string;
  content: string;
}) {
  try {
    const result = await createPost({
      slug,
      title,
      description,
      category,
      tags,
      keywords,
      author,
      image,
      altText,
      content,
    });

    return {
      success: true,
      post: result,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      post: null,
    };
  }
}

export async function serverUpdatePost(
  id: string,
  {
    slug,
    title,
    description,
    category,
    tags,
    keywords,
    author,
    image,
    altText,
    content,
  }: {
    slug: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    keywords: string[];
    author: string;
    image: string;
    altText: string;
    content: string;
  }
) {
  try {
    const result = await updatePost(id, {
      slug,
      title,
      description,
      category,
      tags,
      keywords,
      author,
      image,
      altText,
      content,
    });

    return {
      success: true,
      post: result,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      post: null,
    };
  }
}

export async function serverDeletePost(id: string) {
  try {
    await deletePost(id);
    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message: "Error deleting post",
    };
  }
}

// ============================================================================
// IMAGE SERVER ACTIONS
// ============================================================================

export async function serverUploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const filename = `${file.name}`;
    const r2_key = `images/${filename}`;

    await uploadFileToR2(r2_key, file);

    const url = `${process.env.NEXT_PUBLIC_BUCKET_URL}/${r2_key}`;
    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
}
