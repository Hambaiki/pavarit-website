export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  image: string;
  altText: string;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface PostMetadata {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  keywords: string;
  author: string;
  image: string;
  altText: string;
}
