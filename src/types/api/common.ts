export interface CommonResponse {
  success: boolean;
  message: string;
}

export interface CommentData {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentWithUserData {
  comment_id: number;
  comment_content: string;
  comment_created_at: string;
  comment_updated_at: string;
  post_id: number;
  user_id: number;
  user_name: string;
}

export interface CreateCommentResponse extends CommonResponse {
  comment: CommentData | null;
}

export interface GetCommentsResponse extends CommonResponse {
  comments: CommentWithUserData[];
}

export interface UpdateCommentResponse extends CommonResponse {
  comment: CommentData | null;
}

export interface GetCommentResponse extends CommonResponse {
  comment: CommentData | null;
}
