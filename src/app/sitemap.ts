import { MetadataRoute } from "next";

import { fetchFromApi } from "@/lib/api";
import { SearchPostResponse, TagResponse } from "@/types/api/post";
import { navItems } from "@/constants/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment variable or hardcoded
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pavarit.net";

  // Static routes
  const routes = navItems
    .flatMap((item) => [
      item.href,
      ...item.subItems.map((subItem) => subItem.href),
    ])
    .map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
    }));

  // Dynamic blog posts routes
  const blogResponse = await fetchFromApi<SearchPostResponse>(
    `/api/v1/posts/all`,
    "GET"
  );

  const blogRoutes = blogResponse
    ? blogResponse?.posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    : [];

  const tagResponse = await fetchFromApi<TagResponse>("/api/v1/posts/tag");

  const tagRoutes = tagResponse
    ? tagResponse?.tags.map((tag) => ({
        url: `${baseUrl}/blog/tag/${tag}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      }))
    : [];

  return [...routes, ...blogRoutes, ...tagRoutes];
}
