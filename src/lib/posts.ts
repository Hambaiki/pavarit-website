import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export interface Post {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  image: string;
  altText: string;
  created_at: string;
  updated_at: string;
  content: string;
}

interface PostFrontmatter {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  category?: unknown;
  tags?: unknown;
  keywords?: unknown;
  author?: unknown;
  image?: unknown;
  altText?: unknown;
  createDate?: unknown;
  date?: unknown;
  modifiedDate?: unknown;
}

const postsDirectory = path.join(process.cwd(), "content", "posts");

function stringValue(value: unknown, fallback = ""): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return typeof value === "string" ? value : fallback;
}

function dateValue(value: unknown, fileName: string, fallback = ""): string {
  const dateString = stringValue(value);
  if (!dateString) {
    return fallback;
  }

  const dateOnly = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
  if (dateOnly) {
    const [, yearText, monthText, dayText] = dateOnly;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(`Invalid date in ${fileName}: ${dateString}`);
    }

    return `${yearText}-${monthText.padStart(2, "0")}-${dayText.padStart(
      2,
      "0",
    )}`;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in ${fileName}: ${dateString}`);
  }

  return date.toISOString().slice(0, 10);
}

function parseTags(value: unknown, fileName: string): string[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`Invalid tags in ${fileName}: expected a list`);
  }

  return value.map((tag) => {
    if (typeof tag === "string") {
      return tag;
    }

    if (tag && typeof tag === "object") {
      const tagRecord = tag as { slug?: unknown; name?: unknown };
      const tagValue = tagRecord.slug ?? tagRecord.name;
      if (typeof tagValue === "string") {
        return tagValue;
      }
    }

    throw new Error(`Invalid tag in ${fileName}: expected a string or slug`);
  });
}

async function readPost(fileName: string): Promise<Post> {
  const source = await readFile(path.join(postsDirectory, fileName), "utf8");
  const parsed = matter(source);
  const metadata = parsed.data as PostFrontmatter;

  if (
    typeof metadata.title !== "string" ||
    typeof metadata.slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)
  ) {
    throw new Error(`Invalid title or slug in ${fileName}`);
  }

  let keywords: string[] = [];
  if (metadata.keywords !== undefined) {
    if (
      !Array.isArray(metadata.keywords) ||
      !metadata.keywords.every(
        (keyword: unknown): keyword is string => typeof keyword === "string",
      )
    ) {
      throw new Error(
        `Invalid keywords in ${fileName}: expected a list of strings`,
      );
    }
    keywords = metadata.keywords;
  }

  const createdAt = dateValue(metadata.createDate ?? metadata.date, fileName);
  if (!createdAt) {
    throw new Error(`Missing createDate or date in ${fileName}`);
  }

  return {
    title: metadata.title,
    slug: metadata.slug,
    description: stringValue(metadata.description),
    category: stringValue(metadata.category),
    tags: parseTags(metadata.tags, fileName),
    keywords,
    author: stringValue(metadata.author, "Pavarit Wiriyakunakorn"),
    image: stringValue(metadata.image),
    altText: stringValue(metadata.altText, metadata.title),
    created_at: createdAt,
    updated_at: dateValue(metadata.modifiedDate, fileName, createdAt),
    content: parsed.content,
  };
}

export async function getPosts(): Promise<Post[]> {
  const files = (await readdir(postsDirectory))
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();
  const posts = await Promise.all(files.map(readPost));
  const slugs = new Set<string>();

  for (const post of posts) {
    if (slugs.has(post.slug)) {
      throw new Error(`Duplicate post slug: ${post.slug}`);
    }
    slugs.add(post.slug);
  }

  return posts.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function getPostTags(): Promise<string[]> {
  const tags = new Set((await getPosts()).flatMap((post) => post.tags));
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export async function renderPostContent(content: string): Promise<string> {
  const html = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return html.toString();
}

export function filterPosts(
  posts: Post[],
  { search = "", tags = [] }: { search?: string; tags?: string[] } = {},
): Post[] {
  const normalizedSearch = search.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesTags = tags.every((tag) => post.tags.includes(tag));
    if (!matchesTags) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = [
      post.title,
      post.description,
      post.category,
      post.author,
      ...post.tags,
      ...post.keywords,
      post.content,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}
