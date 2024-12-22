"use client";

import { useEffect, useRef, useState } from "react";

import { FaClock, FaComment, FaUser } from "react-icons/fa6";

import { GetCommentsResponse } from "@/types/api/common";
import { Comment } from "@/types/comments";

import GeneralModal from "@/components/common/GeneralModal";
import CommentForm from "@/components/post/comment/CommentForm";

interface CommentsProps {
  postId: number;
}

function Comments({ postId }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/posts/comments`, {
        method: "POST",
        body: JSON.stringify({ postId }),
      });
      const data: GetCommentsResponse = await response.json();
      const comments: Comment[] = data.comments.map((comment) => ({
        id: comment.comment_id,
        postId: comment.post_id,
        userId: comment.user_id,
        username: comment.user_name,
        content: comment.comment_content,
        createdAt: comment.comment_created_at,
        updatedAt: comment.comment_updated_at,
      }));
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    fetchComments();
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <>
      <div className="mb-4">
        <div className="p-4 bg-neutral-950 rounded-t-xl">
          <p className=" font-bold text-neutral-300">
            Comments ({comments.length})
          </p>
        </div>

        <div
          ref={ref}
          className="max-h-[20rem] overflow-y-scroll bg-neutral-900 divide-y divide-neutral-800 rounded-b-xl"
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <CommentItemSkeleton key={index} />
            ))
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentItem
                key={index}
                comment={comment.content}
                username={comment.username}
                createdAt={comment.createdAt}
                edited={comment.createdAt !== comment.updatedAt}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[20rem]">
              <FaComment className="w-10 h-10 text-neutral-300 mb-2" />
              <p className="text-neutral-300">No comments yet</p>
            </div>
          )}
        </div>
      </div>

      <CommentForm
        postId={postId}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <GeneralModal
        visible={successMessage !== null}
        title="Success"
        message={successMessage || ""}
        onClickPrimary={() => setSuccessMessage(null)}
        onClickOutside={() => setSuccessMessage(null)}
      />

      <GeneralModal
        visible={errorMessage !== null}
        title="Error"
        message={errorMessage || ""}
        onClickPrimary={() => setErrorMessage(null)}
        onClickOutside={() => setErrorMessage(null)}
      />
    </>
  );
}

function CommentItem({
  comment,
  username,
  createdAt,
  edited,
}: {
  comment: string;
  username: string;
  createdAt: string;
  edited: boolean;
}) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaUser />
          <p className="text-sm text-neutral-300">
            <strong>
              {username.slice(0, 1) +
                "*".repeat(username.length - 1).slice(0, 10)}
            </strong>
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <FaClock />
          <p className="text-sm text-neutral-300">
            &nbsp;{new Date(createdAt).toLocaleDateString()}
            {edited && <span className="text-neutral-400"> (edited)</span>}
          </p>
        </div>
      </div>
      <p className="mt-4">{comment}</p>
    </div>
  );
}

function CommentItemSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="h-5 w-1/2 rounded-full bg-neutral-800 animate-pulse" />
      <div className="h-5 w-3/4 rounded-full bg-neutral-800 animate-pulse" />
    </div>
  );
}

export default Comments;
