import fs from "fs";
import path from "path";
import matter from "gray-matter";
import html from "remark-html";
import { remark } from "remark";

import { BlogPost, BlogPostMetadata } from "@/types";
import { GetAllPostsOptions, GetAllPostsResult } from "@/types/posts";

import { fetchMarkdownFile, updatePostToBucket } from "@/utils/posts";

const postsDirectory = path.join(process.cwd(), "public/posts");

// Fetch all posts metadata
export function getPosts(
  {
    search = "",
    page = 1,
    tags = [],
    perPage,
  }: GetAllPostsOptions | undefined = {
    search: "",
    page: 1,
    tags: [],
  }
): GetAllPostsResult {
  const filenames = fs.readdirSync(postsDirectory);

  let allPosts = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ""), // Remove the .md extension
        title: data.title,
        createDate: data.createDate,
        modifiedDate: data.modifiedDate,
        author: data.author,
        authorImage: data.authorImage,
        tags: data.tags,
        category: data.category,
        description: data.description,
        image: data.image,
        socialImage: data.socialImage,
        altText: data.altText,
        keywords: data.keywords,
        relatedPosts: data.relatedPosts,
        faq: data.faq,
        schemaType: data.schemaType,
      } as BlogPostMetadata;
    })
    .sort(
      (a, b) =>
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );

  // Search
  if (search) {
    allPosts = allPosts.filter(
      (post) =>
        post.title.includes(search) ||
        post.description.includes(search) ||
        post.category.includes(search) ||
        post.author.includes(search) ||
        post.tags.some((tag) => tag.name.includes(search)) ||
        post.keywords.some((keyword) => keyword.includes(search))
    );
  }

  if (tags.length > 0) {
    allPosts = allPosts.filter((post) =>
      post.tags.some((tag) => tags.includes(tag.name))
    );
  }

  // Pagination
  const startIndex = perPage ? (page - 1) * perPage : 0;
  const endIndex = perPage ? startIndex + perPage : allPosts.length;

  // Return the paginated posts
  return {
    page: page,
    total: allPosts.length,
    posts: allPosts.slice(startIndex, endIndex),
  };
}

// Fetch post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // const s3FileContents = await fetchMarkdownFile(
    //   process.env.S3_BUCKET_NAME!,
    //   `${slug}.md`
    // );
    // const { data, content } = matter(s3FileContents);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug: slug,
      title: data.title,
      createDate: data.createDate,
      modifiedDate: data.modifiedDate,
      author: data.author,
      authorImage: data.authorImage,
      tags: data.tags,
      category: data.category,
      description: data.description,
      image: data.image,
      socialImage: data.socialImage,
      altText: data.altText,
      keywords: data.keywords,
      relatedPosts: data.relatedPosts,
      faq: data.faq,
      schemaType: data.schemaType,
      content,
      contentHtml,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function updatePost(slug: string, post: BlogPost) {
  try {
    // const markdownContent = matter.stringify(post.content, {
    //   title: post.title,
    //   date: post.date,
    //   author: post.author,
    //   authorImage: post.authorImage,
    //   tags: post.tags,
    //   category: post.category,
    //   description: post.description,
    //   image: post.image,
    //   keywords: post.keywords,
    // });

    // const response = await updatePostToBucket(
    //   process.env.S3_BUCKET_NAME!,
    //   slug,
    //   markdownContent
    // );

    // if (response) {
    //   return true;
    // }

    return false;
  } catch (error) {
    console.error("Error updating post:", error);
    return false;
  }
}

// Fetch all slugs
export function getAllPostSlugs() {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => ({
    params: { slug: filename.replace(/\.md$/, "") },
  }));
}

// Fetch recent posts
export function getRecentPosts(): BlogPostMetadata[] {
  const posts = getPosts({ page: 1, perPage: 4 });
  return posts.posts;
}

// Fetch all tags
export function getAllTags(): string[] {
  const response = getPosts();

  return response.posts
    .flatMap((post) => post.tags.map((tag) => tag.name))
    .filter((tag, index, self) => self.indexOf(tag) === index);
}
