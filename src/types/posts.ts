export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  description: string;
  image: string;
  keywords: string[];
  canonicalUrl: string;
  authorImage: string;
  tags: string[];
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
  contentHtml?: string; // For parsed HTML content
}

export interface GetAllPostsOptions {
  page?: number;
  perPage?: number;
}

export interface GetAllPostsResult {
  page: number;
  total: number;
  posts: BlogPostMetadata[];
}
