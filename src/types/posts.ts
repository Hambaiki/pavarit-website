// export interface BlogPostMetadata {
//   slug: string;
//   title: string;
//   date: string;
//   author: string;
//   category: string;
//   description: string;
//   image: string;
//   keywords: string[];
//   canonicalUrl: string;
//   authorImage: string;
//   tags: string[];
// }

export interface BlogPostMetadata {
  // Core Metadata
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: { name: string; slug: string }[];
  keywords: string[];

  // Dates
  createDate: string; // ISO 8601 format
  modifiedDate: string; // ISO 8601 format

  // Author Details
  author: string;
  authorImage: string;

  // Images
  image: string;
  socialImage: string;
  altText: string;

  // Related Content
  relatedPosts: string[];

  // FAQs
  faq: {
    question: string;
    answer: string;
  }[];

  // Schema
  schemaType: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
  contentHtml?: string; // For parsed HTML content
}

export interface GetAllPostsOptions {
  search?: string;
  page?: number;
  perPage?: number;
  tags?: string[];
}

export interface GetAllPostsResult {
  page: number;
  total: number;
  posts: BlogPostMetadata[];
}
