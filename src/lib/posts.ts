import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { BlogPost, BlogPostMetadata } from "@/types";

const postsDirectory = path.join(process.cwd(), "public/posts");

// Fetch all posts metadata
export function getAllPosts(): BlogPostMetadata[] {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(/\.md$/, ""), // Remove the .md extension
        title: data.title,
        date: data.date,
        author: data.author,
        authorImage: data.authorImage,
        tags: data.tags,
        category: data.category,
        description: data.description,
        image: data.image,
        keywords: data.keywords,
        canonicalUrl: data.canonicalUrl,
      } as BlogPostMetadata;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Fetch post by slug
export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    author: data.author,
    authorImage: data.authorImage,
    tags: data.tags,
    category: data.category,
    description: data.description,
    image: data.image,
    keywords: data.keywords,
    canonicalUrl: data.canonicalUrl,
    content,
  } as BlogPost;
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
  const posts = getAllPosts();
  return posts.slice(0, 3);
}
