"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Button from "@/components/Button";

import {
  FaBold,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
} from "react-icons/fa6";

import ToolbarButton from "@/components/post/editor/ToolbarButton";
import ModalContainer from "@/components/container/ModalContainer";
import matter from "gray-matter";

import { useUser } from "@auth0/nextjs-auth0/client";
interface PostEditorProps {
  onSubmit?: () => void;
}

function PostEditor({ onSubmit }: PostEditorProps) {
  const { user, error, isLoading } = useUser();

  console.log(user);

  const [clearing, setClearing] = useState(false);

  const [metadata, setMetadata] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    image: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML();

    const markdownContent = `---
      title: "${metadata.title}"
      slug: "${metadata.slug}"
      description: "${metadata.description}"
      category: "${metadata.category}"
      tags: [${metadata.tags
        .split(",")
        .map((tag) => `{ name: "${tag.trim()}", slug: "${tag.trim()}" }`)
        .join(", ")}]
      date: "${metadata.date}"
      createDate: "${metadata.date}"
      modifiedDate: "${metadata.date}"
      author: "${metadata.author}"
      image: "${metadata.image}"
      ---

    ${content}
    `;

    // Save markdownContent to a file or send it to a server
    console.log("markdownContent", markdownContent);

    if (content) {
      const data = matter.stringify(content, {
        title: metadata.title,
        date: metadata.date,
        author: metadata.author,
        // authorImage: metadata.authorImage,
        tags: metadata.tags,
        category: metadata.category,
        description: metadata.description,
        image: metadata.image,
        // keywords: metadata.keywords,
      });

      console.log(data);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={metadata.title}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={metadata.slug}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={metadata.author}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={metadata.category}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={metadata.tags}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="date"
            name="date"
            value={metadata.date}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
          <input
            type="text"
            name="image"
            placeholder="Featured Image URL"
            value={metadata.image}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700"
          />
        </div>

        <div className="flex flex-col space-y-2 mt-4">
          <label htmlFor="description" className="text-sm font-bold">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter a short description for your post"
            value={metadata.description}
            onChange={handleMetadataChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 h-24"
          />
        </div>

        {/* Editor Toolbar */}
        <div
          className="flex flex-wrap gap-2 p-2 mt-4 
          bg-neutral-900 rounded-t border border-neutral-700"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <FaBold />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <FaItalic />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
          >
            <span className="text-sm font-bold">H1</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
          >
            <span className="text-sm font-medium">H2</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
          >
            <span className="text-sm font-bold">H3</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            <FaListUl />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          >
            <FaListOl />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter image URL");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
          >
            <FaImage />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter link URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
          >
            <FaLink />
          </ToolbarButton>
        </div>

        {/* Editor Content */}
        <div className="min-h-[400px] bg-neutral-900 rounded-b border border-t-0 border-neutral-700">
          <EditorContent editor={editor} />
        </div>

        <div className="flex flex-row gap-2 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setClearing(true)}
            className="w-full p-3 rounded-full"
          >
            Clear
          </Button>
          <Button type="submit" className="w-full p-3 rounded-full">
            Save Post
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostEditor;
