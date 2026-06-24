import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    tags: text("tags").array().notNull().default([]),
    keywords: text("keywords").array().notNull().default([]),
    author: text("author").notNull(),
    image: text("image").notNull(),
    altText: text("alt_text").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    content: text("content").notNull(),
  },
  (table) => [
    index("idx_posts_category").on(table.category),
    index("idx_posts_slug").on(table.slug),
    index("idx_posts_tags").using("gin", table.tags),
    index("idx_posts_title").on(table.title),
  ]
);

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
