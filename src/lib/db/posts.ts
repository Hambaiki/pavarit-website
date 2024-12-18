import { sql } from "./neon";

export async function getPosts(
  search: string,
  tags: string[],
  page: number,
  per_page: number
) {
  try {
    const offset = (page - 1) * per_page;

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
        LIMIT ${per_page} OFFSET ${offset};
      `;

    return result;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

export async function getPostTotal(search: string, tags: string[]) {
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

    return total[0].count;
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

    return tags.map((tag) => tag.tag);
  } catch (error) {
    console.error("Error getting post tags:", error);
    return [];
  }
}

export async function updatePostViews(id: string) {
  try {
    const result =
      await sql`UPDATE posts SET views = views + 1 WHERE id = ${id}`;

    return result;
  } catch (error) {
    console.error("Error updating post views:", error);
    return null;
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
    INSERT INTO posts (
      id,
      slug,
      title,
      description,
      category,
      tags,
      keywords,
      author,
      image,
      alt_text,
      views,
      created_at,
      updated_at,
      content
    ) VALUES (
      ${id},
      ${slug},
      ${title},
      ${description},
      ${category},
      ${tags},
      ${keywords},
      ${author},
      ${image},
      ${alt_text},
      0,
      NOW(),
      NOW(),
      ${content}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      category = EXCLUDED.category,
      tags = EXCLUDED.tags,
      keywords = EXCLUDED.keywords,
      author = EXCLUDED.author,
      image = EXCLUDED.image,
      alt_text = EXCLUDED.alt_text,
      updated_at = NOW(),
      content = EXCLUDED.content
    RETURNING *;
  `;

    return result;
  } catch (error) {
    console.error("Error updating post:", error);
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

    return result[0].count === 0;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
}
