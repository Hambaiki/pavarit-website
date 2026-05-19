import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  auth0_sub: text("auth0_sub").notNull().unique(),
  email: text("email"),
  name: text("name"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
});

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
    alt_text: text("alt_text").notNull(),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
    content: text("content").notNull(),
  },
  (table) => [
    index("idx_posts_category").on(table.category),
    index("idx_posts_slug").on(table.slug),
    index("idx_posts_tags").using("gin", table.tags),
    index("idx_posts_title").on(table.title),
  ]
);

export const postViews = pgTable(
  "post_views",
  {
    id: serial("id").primaryKey(),
    post_id: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    view_date: date("view_date").notNull(),
    view_count: integer("view_count").default(1),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_post_views_post_id_view_date").on(
      table.post_id,
      table.view_date
    ),
  ]
);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  post_id: integer("post_id").notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  content: text("content").notNull(),
});

export const onlineInquiries = pgTable("online_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const maintenanceSettings = pgTable(
  "maintenance_settings",
  {
    id: serial("id").primaryKey(),
    enabled: boolean("enabled").default(false),
    start_time: timestamp("start_time", {
      mode: "string",
      withTimezone: true,
    }),
    end_time: timestamp("end_time", { mode: "string", withTimezone: true }),
    message: text("message"),
    allowed_ips: text("allowed_ips").array().notNull().default([]),
    created_at: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => [index("idx_maintenance_settings_created_at").on(table.created_at)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostView = typeof postViews.$inferSelect;
export type NewPostView = typeof postViews.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type OnlineInquiry = typeof onlineInquiries.$inferSelect;
export type NewOnlineInquiry = typeof onlineInquiries.$inferInsert;
export type MaintenanceSetting = typeof maintenanceSettings.$inferSelect;
export type NewMaintenanceSetting = typeof maintenanceSettings.$inferInsert;
