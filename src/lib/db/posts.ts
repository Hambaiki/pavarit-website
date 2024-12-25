import { sql } from "./neon";

export async function getPosts({
  search,
  tags,
  page,
  limit,
}: {
  search: string;
  tags: string[];
  page: number;
  limit: number;
}) {
  try {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT *
      FROM posts
      WHERE 
      (title ILIKE ${"%" + search + "%"} OR
      description ILIKE ${"%" + search + "%"} OR
      category ILIKE ${"%" + search + "%"} OR
      author ILIKE ${"%" + search + "%"} OR
      ARRAY_TO_STRING(tags, ',') ILIKE ${"%" + search + "%"} OR
      ARRAY_TO_STRING(keywords, ',') ILIKE ${"%" + search + "%"})
      AND (${tags.length === 0} OR tags && ${tags})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;

    return result;
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
    const total = await sql`
      SELECT COUNT(*)::int AS count
      FROM posts
      WHERE
        (title ILIKE ${"%" + search + "%"} OR
        description ILIKE ${"%" + search + "%"} OR
        category ILIKE ${"%" + search + "%"} OR
        author ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(tags, ',') ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(keywords, ',') ILIKE ${"%" + search + "%"})
        AND (${tags.length === 0} OR tags && ${tags})
    `;

    return total[0].count || 0;
  } catch (error) {
    console.error("Error getting post total:", error);
    return 0;
  }
}

export async function getPostById(id: string) {
  try {
    const post = await sql`SELECT * FROM posts WHERE id = ${id}`;

    return post[0];
  } catch (error) {
    console.error("Error getting post by id:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    // const post = await sql`SELECT * FROM posts WHERE deleted_at IS NULL AND slug = ${slug}`;
    const post = await sql`SELECT * FROM posts WHERE slug = ${slug}`;

    return post[0];
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return null;
  }
}

export async function getPostTags() {
  try {
    const tags =
      await sql`SELECT DISTINCT UNNEST(tags) as tag FROM posts ORDER BY tag`;

    const flatTags = tags.map((r) => r.tag);

    return flatTags;
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
    const result = await sql`
      UPDATE posts 
      SET
        slug = ${slug},
        title = ${title},
        description = ${description},
        category = ${category},
        tags = ${tags},
        keywords = ${keywords},
        author = ${author},
        image = ${image},
        alt_text = ${alt_text},
        content = ${content},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

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
    // Check if slug already exists
    const existingPost = await sql`
      SELECT slug FROM posts WHERE slug = ${slug}
    `;

    if (existingPost.length > 0) {
      throw new Error("Slug must be unique");
    }

    const result = await sql`
      INSERT INTO posts (
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
        created_at,
        updated_at
      ) VALUES (
        ${slug},
        ${title},
        ${description},
        ${category},
        ${tags},
        ${keywords},
        ${author},
        ${image},
        ${alt_text},
        ${content},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return result;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export async function deletePost(id: string) {
  try {
    const result = await sql`DELETE FROM posts WHERE id = ${id}`;

    return result;
  } catch (error) {
    console.error("Error deleting post:", error);
    return null;
  }
}

export async function getPostMetadata(slug: string) {
  try {
    const post = await sql`SELECT * FROM posts WHERE slug = ${slug}`;

    return post[0];
  } catch (error) {
    console.error("Error getting post metadata:", error);
    return null;
  }
}

export async function checkSlugUnique(slug: string) {
  try {
    const result = await sql`SELECT COUNT(*) FROM posts WHERE slug = ${slug}`;

    return result[0].count === "0";
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
}
