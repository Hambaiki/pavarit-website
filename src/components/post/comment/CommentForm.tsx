"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import { FaPen } from "react-icons/fa6";

import TextAreaInput from "@/components/form/TextAreaInput";
import Button from "@/components/Button";
import Spinner from "@/components/navigation/Spinner";

function CommentForm({
  postId,
  onSuccess,
  onError,
}: {
  postId: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const [formData, setFormData] = useState<{ comment: string }>({
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ comment: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!user) return;

      const response = await fetch(`/api/v1/posts/comments`, {
        method: "PUT",
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id,
          content: formData.comment,
        }),
      });

      if (response.ok) {
        onSuccess("Comment submitted successfully");
      } else if (response.status === 429) {
        onError("Too many submissions, please try again later.");
      } else {
        onError("Failed to submit comment");
      }
    } catch (error) {
      onError("Failed to submit comment");
    }
  };

  return (
    <div className="flex flex-col p-4 bg-neutral-950 rounded-xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : user ? (
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-neutral-300 mb-4">
            <FaPen className="mr-2 inline-block" />
            Leave a comment below and share your thoughts.
          </p>

          <TextAreaInput
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your comment here..."
            className="w-full min-h-[5rem]"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="mt-4 px-4 py-2 rounded-lg"
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 min-h-[6rem] bg-neutral-950 rounded-lg">
          <p className="text-neutral-300">
            Please&nbsp;
            <Link
              href={`/api/auth/login?returnTo=${pathname}`}
              className="text-suzuha-teal-500 underline hover:text-suzuha-teal-600 transition-colors"
            >
              login
            </Link>
            &nbsp;to leave a comment.
          </p>
        </div>
      )}
    </div>
  );
}

export default CommentForm;
