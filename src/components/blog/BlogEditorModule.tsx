"use client";

import { useState } from "react";

import RichTextEditor from "@/components/blog/RichTextEditor";

const BlogEditorModule = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleSaveBlog = (content: string) => {
    setHtmlContent(content);
  };

  return (
    <>
      {/* Display Saved Content */}
      {htmlContent && (
        <div className="mt-6 w-full border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold mb-2">Saved Content:</h2>
          <div
            className="p-4 bg-gray-100 border border-gray-200 rounded"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        </div>
      )}
      <RichTextEditor onSave={(content) => {}} />
    </>
  );
};

export default BlogEditorModule;
