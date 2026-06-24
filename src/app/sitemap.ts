import { MetadataRoute } from "next";

import { navItems } from "@/constants/navigation";
import { serverGetAllPosts, serverGetPostTags } from "@/features/blog/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment variable or hardcoded
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pavarit.net";

  // Static routes
  const routes = navItems
    .flatMap((item) => [
      item.href,
      ...item.subItems.map((subItem) => subItem.href),
    ])
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
    }));

  // Dynamic blog posts routes
  const posts = await serverGetAllPosts();

  const blogRoutes = posts
    ? posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    : [];

  const tagResult = await serverGetPostTags();
  const tags = tagResult?.tags || [];

  const tagRoutes = tags
    ? tags.map((tag) => ({
        url: `${baseUrl}/blog/tag/${tag}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      }))
    : [];

  return [...routes, ...blogRoutes, ...tagRoutes];
}
