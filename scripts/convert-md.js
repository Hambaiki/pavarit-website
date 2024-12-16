import { remark } from "remark";
import html from "remark-html";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function addPost(postData) {
  // Extract necessary fields
  const {
    title,
    slug,
    description,
    category,
    tags,
    keywords,
    author,
    authorImage: author_image,
    image,
    altText: alt_text,
    content,
  } = postData;

  // Convert Markdown content to HTML
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  // Prepare tags and keywords (if objects, map to string array)
  const parsedTags = Array.isArray(tags)
    ? tags.map((tag) => tag.name || tag)
    : [];
  const parsedKeywords = Array.isArray(keywords) ? keywords : [];

  // Insert into the database
  try {
    const result = await sql`
      INSERT INTO posts (
        slug, title, description, category, tags, keywords, author_name, author_image, image, alt_text, content
      ) VALUES (
        ${slug}, ${title}, ${description}, ${category}, ${parsedTags}, ${parsedKeywords}, ${author}, ${author_image}, ${image}, ${alt_text}, ${contentHtml}
      )
      RETURNING *;
    `;

    console.log("Post added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error inserting post:", error);
    throw error;
  }
}

const postData = require("../public/posts/train-trip.md");

addPost(postData).catch((err) => console.error(err));
