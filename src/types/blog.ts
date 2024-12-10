export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  description: string;
  image: string;
  keywords: string[];
  canonicalUrl: string;
  authorImage: string;
  content: string;
  contentHtml?: string; // For parsed HTML content
}

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
