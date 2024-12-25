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
  const maxLength = 300;

  const { user, isLoading } = useUser();
  const pathname = usePathname();

  const [formData, setFormData] = useState<{ comment: string }>({
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ comment: e.target.value.slice(0, maxLength) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.comment.length === 0 || formData.comment.length > maxLength) {
      onError(`Comment must be between 1 and ${maxLength} characters.`);
      return;
    }

    try {
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
        setFormData({ comment: "" });
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
    <div className="flex flex-col rounded-xl bg-gray-850 p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : user ? (
        <form onSubmit={handleSubmit}>
          <p className="mb-4">
            <FaPen className="mr-2 inline-block" />
            Leave a comment below and share your thoughts.
          </p>

          <p className="mb-2 text-sm text-gray-500">
            Maximum {maxLength} characters.
          </p>

          <TextAreaInput
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your comment here..."
            className="w-full min-h-[5rem] max-h-[10rem]"
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
        <div className="flex flex-col items-center justify-center min-h-[6rem] rounded-lg">
          <p>
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
