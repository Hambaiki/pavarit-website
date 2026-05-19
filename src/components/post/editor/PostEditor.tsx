"use client";

import { useEffect, useState } from "react";

import NextImage from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Youtube from "@tiptap/extension-youtube";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import imageCompression from "browser-image-compression";
import { useForm, useWatch } from "react-hook-form";
import {
  FaBold,
  FaCode,
  FaDivide,
  FaImage,
  FaImages,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaQuoteRight,
  FaTable,
  FaYoutube,
} from "react-icons/fa6";
import { z } from "zod";

import Button from "@/components/Button";
import GeneralModal from "@/components/common/GeneralModal";
import TextAreaInput from "@/components/form/v1/TextAreaInput";
import TextInput from "@/components/form/v1/TextInput";
import Loading from "@/components/navigation/Loading";
import ToolbarButton from "@/components/post/editor/ToolbarButton";
import { slugify } from "@/lib/string";
import { PostMetadata } from "@/types/posts";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  keywords: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  image: z.string().optional(),
  altText: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

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

function PostEditor({ postMetadata, postContent, onSubmit }: PostEditorProps) {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [isUploadPostImage, setIsUploadPostImage] = useState(false);
  const [isUploadFeaturedImage, setIsUploadFeaturedImage] = useState(false);
  const [isUploadingImageError, setIsUploadingImageError] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      tags: "",
      keywords: "",
      author: "",
      image: "",
      altText: "",
    },
  });

  const featuredImage = useWatch({ control, name: "image" });
  const featuredAltText = useWatch({ control, name: "altText" });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      HeadingWithId.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content: postContent,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    reset({
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
  }, [postMetadata, reset]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(postContent || "");
    }
  }, [postContent, editor]);

  const handleStartUploadFeaturedImage = async () => {
    if (!imageFile) return;

    const imageData = await handleStartUploadImage(imageFile);

    if (imageData) {
      setValue("image", imageData.image);
      setValue("altText", imageData.altText);
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
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      const compressedFile = await imageCompression(imageFile, options);

      const formData = new FormData();
      formData.append("file", new File([compressedFile], `${Date.now()}.jpeg`));

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

  const onFormSubmit = (data: PostFormValues) => {
    onSubmit?.({
      metadata: data as PostMetadata,
      content: editor?.getHTML() || "",
    });
  };

  if (!editor) {
    return <Loading />;
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, width) || 640,
        height: Math.max(180, height) || 480,
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Metadata Fields */}
          <div className="mt-8">
            <h2 className="mb-4">Post Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 card rounded-xl">
              <TextInput
                label="Title"
                type="text"
                placeholder="Title of the post"
                error={errors.title?.message}
                required
                {...register("title")}
              />
              <TextInput
                label="Slug"
                type="text"
                placeholder="Slug of the post"
                error={errors.slug?.message}
                required
                {...register("slug")}
              />
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Description"
                  placeholder="Enter a short description for your post"
                  className="min-h-24"
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>
              <TextInput
                label="Tags (comma separated)"
                type="text"
                placeholder="tag-1, tag-2,..."
                error={errors.tags?.message}
                {...register("tags")}
              />
              <TextInput
                label="Keywords (comma separated)"
                type="text"
                placeholder="keyword-1, keyword-2,..."
                error={errors.keywords?.message}
                {...register("keywords")}
              />
              <TextInput
                label="Category"
                type="text"
                placeholder="Category of the post"
                error={errors.category?.message}
                {...register("category")}
              />
              <TextInput
                label="Author"
                type="text"
                placeholder="Author of the post"
                error={errors.author?.message}
                {...register("author")}
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4">Featured Image</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 card rounded-xl">
              <div className="w-full h-72 rounded-lg overflow-hidden">
                {featuredImage ? (
                  <NextImage
                    src={featuredImage}
                    alt={featuredAltText || ""}
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaImage className="text-gray-400 w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <TextInput
                    label="Image Alt Text"
                    type="text"
                    placeholder="Image Alt Text"
                    error={errors.altText?.message}
                    {...register("altText")}
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
            <h2 className="mb-4">Post Content</h2>

            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 mt-4 card rounded-t-md">
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
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
              >
                <FaQuoteLeft />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive("codeBlock")}
              >
                <FaCode />
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

              <div className="flex flex-row card rounded-lg p-1 gap-2">
                <TextInput
                  id="width"
                  type="number"
                  min="320"
                  max="1024"
                  placeholder="width"
                  value={width}
                  onChange={(event) => setWidth(parseInt(event.target.value))}
                />
                <TextInput
                  id="height"
                  type="number"
                  min="180"
                  max="720"
                  placeholder="height"
                  value={height}
                  onChange={(event) => setHeight(parseInt(event.target.value))}
                />
                <button
                  type="button"
                  id="add"
                  onClick={addYoutubeVideo}
                  className="flex flex-row items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors px-4 py-2 rounded-md"
                >
                  <FaYoutube className="w-4 h-4" />
                  Add YouTube video
                </button>
              </div>
            </div>

            <div className="flex-row gap-2 hidden">
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                Insert table
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                Delete column
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                Delete row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().mergeCells().run()}
              >
                Merge cells
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().splitCell().run()}
              >
                Split cell
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
              >
                Toggle header column
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle header row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
              >
                Toggle header cell
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
              >
                Merge or split
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().setCellAttribute("colspan", 2).run()
                }
              >
                Set cell attribute
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().fixTables().run()}
              >
                Fix tables
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().goToNextCell().run()}
              >
                Go to next cell
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().goToPreviousCell().run()}
              >
                Go to previous cell
              </button>
            </div>

            {/* Editor Content */}
            <div
              className="min-h-80 max-h-120 card rounded-b-md
              overflow-y-auto scrollbar-thin"
            >
              <EditorContent editor={editor} className="prose" />
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 p-3 rounded-full"
            >
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
