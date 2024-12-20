"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import imageCompression from "browser-image-compression";
import { Heading } from "@tiptap/extension-heading";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import {
  FaBold,
  FaDivide,
  FaImage,
  FaImages,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
} from "react-icons/fa6";

import { PostMetadata } from "@/types/post";
import { slugify } from "@/utils/slugify";

import Button from "@/components/Button";
import ToolbarButton from "@/components/post/editor/ToolbarButton";
import TextInput from "@/components/form/TextInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import GeneralModal from "@/components/common/GeneralModal";
import Loading from "@/components/navigation/Loading";

interface PostEditorProps {
  postMetadata?: PostMetadata;
  postContent?: string;
  onSubmit?: ({
    metadata,
    content,
  }: {
    metadata: PostMetadata;
    content: string;
  }) => void;
  onSuccess?: () => void;
  onError?: () => void;
}

function PostEditor({
  postMetadata,
  postContent,
  onSubmit,
  onSuccess,
  onError,
}: PostEditorProps) {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isUploadPostImage, setIsUploadPostImage] = useState(false);
  const [isUploadFeaturedImage, setIsUploadFeaturedImage] = useState(false);
  const [isUploadingImageError, setIsUploadingImageError] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [metadata, setMetadata] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    keywords: "",
    author: "",
    image: "",
    altText: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }), // disable default heading
      HeadingWithId.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: postContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMetadata({
      title: postMetadata?.title || "",
      slug: postMetadata?.slug || "",
      description: postMetadata?.description || "",
      category: postMetadata?.category || "",
      tags: postMetadata?.tags || "",
      keywords: postMetadata?.keywords || "",
      author: postMetadata?.author || "",
      image: postMetadata?.image || "",
      altText: postMetadata?.altText || "",
    });
  }, [postMetadata]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(postContent || "");
    }
  }, [postContent, editor]);

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartUploadFeaturedImage = async () => {
    if (!imageFile) return;

    const imageData = await handleStartUploadImage(imageFile);

    if (imageData) {
      setMetadata((prev) => ({
        ...prev,
        image: imageData.image,
        altText: imageData.altText,
      }));
    }
  };

  const handleStartUploadPostImage = async () => {
    if (!imageFile || !editor) return;

    const imageData = await handleStartUploadImage(imageFile);

    if (imageData) {
      handleAddImage(imageData.image, imageData.altText, editor);
    }
  };

  const handleStartUploadImage = async (imageFile: File) => {
    setIsUploadPostImage(false);
    setIsUploadFeaturedImage(false);
    setIsUploadingImage(true);

    try {
      const imageUrl = await handleUploadImage(imageFile);

      if (imageUrl) {
        return { image: imageUrl, altText };
      } else {
        setIsUploadingImageError(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploadingImageError(true);
    } finally {
      setImageFile(undefined);
      setAltText("");
      setIsUploadingImage(false);
    }
  };

  const handleUploadImage = async (imageFile: File) => {
    setIsUploadingImage(true);

    try {
      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1024, // Maximum width or height in pixels
        useWebWorker: true, // Enable web worker for performance
        fileType: "image/jpeg", // Convert all images to JPEG format
      };

      const compressedFile = await imageCompression(imageFile, options);

      // Create form data with compressed image
      const formData = new FormData();
      formData.append("file", new File([compressedFile], `${Date.now()}.jpeg`));

      // Upload the compressed image
      const response = await fetch("/api/v1/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        return data.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddImage = (
    imageUrl: string,
    altText: string,
    targetEditor: Editor
  ) => {
    targetEditor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
        alt: altText,
      })
      .run();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.({
      metadata: {
        title: metadata.title,
        slug: metadata.slug,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags,
        keywords: metadata.keywords,
        author: metadata.author,
        image: metadata.image,
        altText: metadata.altText,
      },
      content: editor?.getHTML() || "",
    });
  };

  if (!editor) {
    return <Loading />;
  }

  return (
    <>
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Metadata Fields */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Post Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-950 rounded-xl">
              <TextInput
                label="Title"
                type="text"
                name="title"
                placeholder="Title of the post"
                value={metadata.title}
                onChange={handleMetadataChange}
              />
              <TextInput
                label="Slug"
                type="text"
                name="slug"
                placeholder="Slug of the post"
                value={metadata.slug}
                onChange={handleMetadataChange}
              />
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Description"
                  name="description"
                  placeholder="Enter a short description for your post"
                  value={metadata.description}
                  onChange={handleMetadataChange}
                  className="min-h-[6rem]"
                />
              </div>
              <TextInput
                label="Tags (comma separated)"
                type="text"
                name="tags"
                placeholder="tag-1, tag-2,..."
                value={metadata.tags}
                onChange={handleMetadataChange}
              />
              <TextInput
                label="Keywords (comma separated)"
                type="text"
                name="keywords"
                placeholder="keyword-1, keyword-2,..."
                value={metadata.keywords}
                onChange={handleMetadataChange}
              />
              <TextInput
                label="Category"
                type="text"
                name="category"
                placeholder="Category of the post"
                value={metadata.category}
                onChange={handleMetadataChange}
              />
              <TextInput
                label="Author"
                type="text"
                name="author"
                placeholder="Author of the post"
                value={metadata.author}
                onChange={handleMetadataChange}
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Image</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-950 rounded-xl">
              <div className="w-full h-72 rounded-lg overflow-hidden">
                {metadata.image ? (
                  <NextImage
                    src={metadata.image}
                    alt={metadata.altText}
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <FaImage className="text-neutral-400 w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <TextInput
                    label="Image Alt Text"
                    type="text"
                    name="altText"
                    placeholder="Image Alt Text"
                    value={metadata.altText}
                    onChange={handleMetadataChange}
                  />
                </div>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsUploadFeaturedImage(true)}
                  className="w-full h-10 text-sm rounded-full"
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Post Details</h2>
            {/* Editor Toolbar */}
            <div
              className="flex flex-wrap gap-2 p-2 mt-4 
            bg-neutral-900 rounded-t-md border border-primary-gray-border"
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
                <span className="text-sm font-bold">H2</span>
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
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                active={editor.isActive("horizontalRule")}
              >
                <FaDivide />
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
              <ToolbarButton onClick={() => setIsUploadPostImage(true)}>
                <FaImage />
              </ToolbarButton>
              <ToolbarButton onClick={() => setIsUrlModalOpen(true)}>
                <FaLink />
              </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="min-h-[20rem] bg-neutral-900 rounded-b-md border border-t-0 border-primary-gray-border">
              <EditorContent
                editor={editor}
                className="prose max-w-none 
                  prose-img:rounded-xl prose-img:mx-auto prose-img:max-w-lg prose-img:w-full 
                  prose-hr:border-neutral-600"
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDiscarding(true)}
              className="flex-1 p-3 rounded-full"
            >
              Discard Changes
            </Button>
            <Button type="submit" className="flex-1 p-3 rounded-full">
              Save Post
            </Button>
          </div>
        </form>
      </div>

      <>
        <GeneralModal
          visible={isUrlModalOpen}
          title="Enter Image URL"
          message="Enter the URL of the image you want to insert into your post."
          primaryButtonText="Insert"
          onClickPrimary={() => {
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
              setIsUrlModalOpen(false);
              setUrl("");
            }
          }}
          secondaryButtonText="Cancel"
          onClickSecondary={() => setIsUrlModalOpen(false)}
        >
          <TextInput
            label="URL"
            type="text"
            name="url"
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </GeneralModal>

        <GeneralModal
          visible={isUploadPostImage || isUploadFeaturedImage}
          title="Upload Image"
          primaryButtonText="Upload"
          onClickPrimary={
            isUploadPostImage
              ? handleStartUploadPostImage
              : handleStartUploadFeaturedImage
          }
          secondaryButtonText="Cancel"
          onClickSecondary={() => {
            setIsUploadPostImage(false);
            setIsUploadFeaturedImage(false);
          }}
        >
          <div className="flex flex-col gap-2">
            <TextInput
              label="Image"
              type="file"
              name="image"
              accept="image/*"
              placeholder="Upload an image"
              onChange={(e) => setImageFile(e.target.files?.[0])}
            />
            <TextInput
              label="Alt Text"
              type="text"
              name="alt_text"
              placeholder="Enter an alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </GeneralModal>

        <GeneralModal
          visible={discarding}
          title="Discard Changes"
          message="Are you sure you want to discard the changes?"
          primaryButtonText="Discard"
          onClickPrimary={() => router.back()}
          secondaryButtonText="Cancel"
          onClickSecondary={() => setDiscarding(false)}
        />

        <GeneralModal
          visible={isUploadingImageError}
          title="Error"
          message="There was an error uploading your image."
          primaryButtonText="Understood"
          onClickPrimary={() => setIsUploadingImageError(false)}
        />

        <GeneralModal
          visible={isUploadingImage}
          title="Uploading Image"
          message="Please wait while your image is being uploaded."
        />
      </>
    </>
  );
}

const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.id = slugify(node.textContent);
    return ["h" + node.attrs.level, HTMLAttributes, 0];
  },
});

export default PostEditor;
