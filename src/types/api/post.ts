export interface PostMetadata {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  image: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

export interface PostData extends PostMetadata {
  content: string;
}

export interface TagResponse {
  tags: string[];
}

export interface GetPostByIdRequest {
  id: number;
}

export interface GetPostResponse {
  post: PostData;
}

export interface GetPostMetadataResponse {
  metadata: PostMetadata;
}

export interface SearchPostRequest {
  search: string;
  page: number;
  limit: number;
  tags: string[];
}

export interface SearchPostResponse {
  page: number;
  limit: number;
  total: number;
  posts: PostData[];
}

export interface CreatePostRequest {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  author: string;
  image: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
  content: string;
}

export interface CreatePostResponse {
  post: PostData;
}

export interface CheckSlugUniqueResponse {
  unique: boolean;
}
