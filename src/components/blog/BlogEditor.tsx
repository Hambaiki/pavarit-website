"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";

interface BlogEditorProps {
  onSave: (content: string) => void;
}

const BlogEditor = ({ onSave }: BlogEditorProps) => {
  const [content, setContent] = useState<string>("");

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-10 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Write Your Blog</h1>
      <ReactQuill
        className="w-full"
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder="Write your article here..."
      />
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        onClick={handleSave}
      >
        Save Blog
      </button>
    </div>
  );
};

export default BlogEditor;
