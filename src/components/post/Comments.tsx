"use client";

import { useState } from "react";
import { FaPen, FaUser } from "react-icons/fa6";

import TextAreaInput from "@/components/form/TextAreaInput";
import Button from "@/components/Button";

function Comments() {
  return (
    <div className="space-y-4">
      <CommentForm />

      {mockComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment.comment}
          username={comment.username}
          createdAt={comment.createdAt}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  username,
  createdAt,
}: {
  comment: string;
  username: string;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col bg-neutral-900 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <FaUser />
        <p className="text-sm text-neutral-300">
          <strong>{username}</strong> - {createdAt}
        </p>
      </div>
      <p className="mt-4">{comment}</p>
    </div>
  );
}

function CommentForm() {
  const [formData, setFormData] = useState<{ comment: string }>({
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ comment: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col p-4 bg-neutral-950 rounded-lg">
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
    </div>
  );
}

const mockComments = [
  {
    id: 1,
    username: "John Doe",
    comment: "This is a comment",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    username: "Jane Doe",
    comment: "This is a comment",
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    username: "John Doe",
    comment: "This is a comment",
    createdAt: "2024-01-01",
  },
];

export default Comments;
