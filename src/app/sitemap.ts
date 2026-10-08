import type { MetadataRoute } from "next";

import { navItems } from "@/constants/navigation";
import { getPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPathSet = new Set(
    navItems
      .flatMap((item) => [
        item.href,
        ...item.subItems.map((subItem) => subItem.href),
      ])
      .map((route) => route.split("#", 1)[0]),
  );
  const staticPaths = Array.from(staticPathSet);
  const routes = staticPaths.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));

  const posts = await getPosts();
  const blogRoutes = posts.map((post) => ({
    url: new URL(`/posts/${post.slug}`, siteUrl).toString(),
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const latestUpdateByTag = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag.startsWith("_")) {
        continue;
      }

      const latestUpdate = latestUpdateByTag.get(tag);
      if (!latestUpdate || post.updated_at > latestUpdate) {
        latestUpdateByTag.set(tag, post.updated_at);
      }
    }
  }

  const tagRoutes = Array.from(latestUpdateByTag.entries())
    .sort(([firstTag], [secondTag]) => firstTag.localeCompare(secondTag))
    .map(([tag, latestUpdate]) => ({
      url: new URL(`/posts/tag/${tag}`, siteUrl).toString(),
      lastModified: new Date(latestUpdate),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

  return [...routes, ...blogRoutes, ...tagRoutes];
}
