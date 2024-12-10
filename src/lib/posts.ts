import fs from "fs";
import path from "path";
import matter from "gray-matter";

import html from "remark-html";
import { remark } from "remark";

import { BlogPost, BlogPostMetadata } from "@/types";
import { GetAllPostsOptions, GetAllPostsResult } from "@/types/posts";

const postsDirectory = path.join(process.cwd(), "public/posts");

// Fetch all posts metadata
export function getPosts(
  { search = "", page = 1, perPage = 10 }: GetAllPostsOptions | undefined = {
    search: "",
    page: 1,
    perPage: 10,
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

  // Search
  if (search) {
    allPosts = allPosts.filter(
      (post) =>
        post.title.includes(search) ||
        post.description.includes(search) ||
        post.category.includes(search) ||
        post.author.includes(search) ||
        post.tags.some((tag) => tag.includes(search)) ||
        post.keywords.some((keyword) => keyword.includes(search))
    );
  }

  // Pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Return the paginated posts
  return {
    page: page,
    total: allPosts.length,
    posts: allPosts.slice(startIndex, endIndex),
  };
}

// Fetch post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

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
    contentHtml,
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
  const posts = getPosts({ page: 1, perPage: 4 });
  return posts.posts;
}
