import { sql } from "./neon";

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
  sort:
    | "MOST_VIEWED"
    | "MOST_VIEWED_LAST_30_DAYS"
    | "MOST_VIEWED_LAST_7_DAYS"
    | "MOST_RECENT";
}) {
  try {
    const offset = (page - 1) * limit;

    const result = await sql`
    SELECT *
    FROM (
      SELECT 
        posts.*, 
        COALESCE(SUM(post_views.view_count), 0) AS total_view_count
      FROM posts
      LEFT JOIN post_views 
        ON posts.id = post_views.post_id
      WHERE 
        (title ILIKE ${"%" + search + "%"} OR
        description ILIKE ${"%" + search + "%"} OR
        category ILIKE ${"%" + search + "%"} OR
        author ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(tags, ',') ILIKE ${"%" + search + "%"} OR
        ARRAY_TO_STRING(keywords, ',') ILIKE ${"%" + search + "%"})
        AND (${tags.length === 0} OR tags && ${tags})
      GROUP BY posts.id
    ) subquery
    ORDER BY
      CASE 
        WHEN ${sort === "MOST_RECENT"} THEN created_at 
        ELSE NULL 
      END DESC,
      CASE 
        WHEN ${sort === "MOST_VIEWED"} THEN total_view_count 
        ELSE NULL 
      END DESC
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

export async function updatePostViews(id: string) {
  try {
    const result = await sql`
      INSERT INTO post_views (post_id, view_date, view_count)
      VALUES (
        (SELECT id FROM posts WHERE id = ${id}),
        NOW(),
        1
      )
    `;

    return result;
  } catch (error) {
    console.error("Error updating post views:", error);
    return null;
  }
}
