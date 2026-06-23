CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(128),
	"title" text,
	"duration" varchar(64) DEFAULT '',
	"location" text DEFAULT '',
	"image" text DEFAULT '',
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"type" varchar(64) DEFAULT '',
	"company_name" text,
	"company_logo" text DEFAULT '',
	"description" text DEFAULT '',
	"duration" varchar(64) DEFAULT '',
	"location" text DEFAULT '',
	"skills" json DEFAULT '[]',
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "featured_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text,
	"alt" text DEFAULT '',
	"description" text DEFAULT '',
	"order" integer DEFAULT 0,
	"visible" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "maintenance_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"message" text,
	"allowed_ips" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "online_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"subject" text,
	"message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"view_date" date NOT NULL,
	"view_count" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"author" text NOT NULL,
	"image" text NOT NULL,
	"alt_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"content" text NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(128) NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth0_sub" text NOT NULL,
	"email" text,
	"name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_auth0_sub_unique" UNIQUE("auth0_sub")
);
--> statement-breakpoint
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_maintenance_settings_created_at" ON "maintenance_settings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_post_views_post_id_view_date" ON "post_views" USING btree ("post_id","view_date");--> statement-breakpoint
CREATE INDEX "idx_posts_category" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_posts_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_posts_tags" ON "posts" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "idx_posts_title" ON "posts" USING btree ("title");