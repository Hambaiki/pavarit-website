import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "./index";
import { posts } from "./schema";

export async function getAllPosts() {
  try {
    return await db.select().from(posts);
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

export async function getPosts({
  search,
  tags,
  page,
  limit,
  sort = "MOST_RECENT",
}: {
  search: string;
  tags: string[];
  page: number;
  limit: number;
  sort: "MOST_RECENT";
}) {
  try {
    const offset = (page - 1) * limit;

    const searchFilter = or(
      ilike(posts.title, `%${search}%`),
      ilike(posts.description, `%${search}%`),
      ilike(posts.category, `%${search}%`),
      ilike(posts.author, `%${search}%`),
      sql`ARRAY_TO_STRING(${posts.tags}, ',') ILIKE ${`%${search}%`}`,
      sql`ARRAY_TO_STRING(${posts.keywords}, ',') ILIKE ${`%${search}%`}`
    );

    const tagsFilter =
      tags.length === 0
        ? undefined
        : sql`${posts.tags} && ARRAY[${sql.join(
            tags.map((tag) => sql`${tag}`),
            sql`, `
          )}]`;

    const whereClause = tagsFilter
      ? and(searchFilter, tagsFilter)
      : searchFilter;

    return await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        category: posts.category,
        tags: posts.tags,
        keywords: posts.keywords,
        author: posts.author,
        image: posts.image,
        alt_text: posts.alt_text,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        content: posts.content,
      })
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.created_at))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

export async function getPostTotal({
  search,
  tags,
}: {
  search: string;
  tags: string[];
}) {
  try {
    const searchFilter = or(
      ilike(posts.title, `%${search}%`),
      ilike(posts.description, `%${search}%`),
      ilike(posts.category, `%${search}%`),
      ilike(posts.author, `%${search}%`),
      sql`ARRAY_TO_STRING(${posts.tags}, ',') ILIKE ${`%${search}%`}`,
      sql`ARRAY_TO_STRING(${posts.keywords}, ',') ILIKE ${`%${search}%`}`
    );

    const tagsFilter =
      tags.length === 0
        ? undefined
        : sql`${posts.tags} && ARRAY[${sql.join(
            tags.map((tag) => sql`${tag}`),
            sql`, `
          )}]`;

    const result = await db
      .select({ count: count() })
      .from(posts)
      .where(and(searchFilter, tagsFilter));

    return result[0].count ?? 0;
  } catch (error) {
    console.error("Error getting post total:", error);
    return 0;
  }
}

export async function getPostById(id: string) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(id)));
    return result[0] ?? null;
  } catch (error) {
    console.error("Error getting post by id:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const result = await db.select().from(posts).where(eq(posts.slug, slug));
    return result[0] ?? null;
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return null;
  }
}

export async function getPostTags() {
  try {
    const result = await db.execute(
      sql`SELECT DISTINCT UNNEST(tags) AS tag FROM posts ORDER BY tag`
    );
    return result.rows.map((r) => r.tag as string);
  } catch (error) {
    console.error("Error getting post tags:", error);
    return [];
  }
}

export async function updatePost(
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
    alt_text,
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
    alt_text: string;
    content: string;
  }
) {
  try {
    const result = await db
      .update(posts)
      .set({
        slug,
        title,
        description,
        category,
        tags,
        keywords,
        author,
        image,
        alt_text,
        content,
        updated_at: sql`NOW()`,
      })
      .where(eq(posts.id, Number(id)))
      .returning();
    return result;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

export async function createPost({
  slug,
  title,
  description,
  category,
  tags,
  keywords,
  author,
  image,
  alt_text,
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
  alt_text: string;
  content: string;
}) {
  try {
    const existing = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.slug, slug));

    if (existing.length > 0) {
      throw new Error("Slug must be unique");
    }

    const result = await db
      .insert(posts)
      .values({
        slug,
        title,
        description,
        category,
        tags,
        keywords,
        author,
        image,
        alt_text,
        content,
      })
      .returning();
    return result;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export async function deletePost(id: string) {
  try {
    return await db.delete(posts).where(eq(posts.id, Number(id)));
  } catch (error) {
    console.error("Error deleting post:", error);
    return null;
  }
}

export async function getPostMetadata(slug: string) {
  try {
    const result = await db.select().from(posts).where(eq(posts.slug, slug));
    return result[0] ?? null;
  } catch (error) {
    console.error("Error getting post metadata:", error);
    return null;
  }
}

export async function checkSlugUnique(slug: string) {
  try {
    const result = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.slug, slug));
    return result[0].count === 0;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
}

