import { sql } from "@/lib/db/neon";

import { Comment } from "@/types/comments";

export async function createComment(comment: Partial<Comment>) {
  try {
    const newComment = await sql(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
      [comment.postId, comment.userId, comment.content]
    );
    return newComment[0];
  } catch (error) {
    console.error("Error creating comment:", error);
  }
}

export async function getComments({ postId }: { postId: number }) {
  try {
    const comments = await sql(
      `SELECT 
         comments.id AS comment_id, 
         comments.content AS comment_content, 
         comments.created_at AS comment_created_at,
         comments.updated_at AS comment_updated_at,
         comments.post_id AS post_id,
         users.id AS user_id,
         users.name AS user_name
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = $1`,
      [postId]
    );
    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
  }
}

export async function updateComment(comment: Partial<Comment>) {
  try {
    const updatedComment = await sql(
      "UPDATE comments SET content = $1 WHERE id = $2",
      [comment.content, comment.id]
    );
    return updatedComment[0];
  } catch (error) {
    console.error("Error updating comment:", error);
  }
}

export async function deleteComment(id: string) {
  try {
    await sql("DELETE FROM comments WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}
