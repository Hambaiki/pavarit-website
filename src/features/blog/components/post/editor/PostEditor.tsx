"use client";

import { useEffect, useRef, useState } from "react";

import NextImage from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { useForm, useWatch } from "react-hook-form";
import { FaImage, FaSliders, FaXmark } from "react-icons/fa6";
import { z } from "zod";

import Button from "@/components/Button";
import { FileUpload, TextInput, Textarea } from "@/components/form/v2";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { serverUploadImage } from "@/features/blog/actions";
import RichTextEditor, {
  RichTextEditorHandle,
} from "@/features/blog/components/editor/RichTextEditor";
import { cn } from "@/lib/cn";
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
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [imageFile, setImageFile] = useState<File>();
  const [altText, setAltText] = useState("");
  const [isUploadFeaturedImage, setIsUploadFeaturedImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingImageError, setIsUploadingImageError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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

  const handleUploadFeaturedImage = async () => {
    if (!imageFile) return;

    setIsUploadFeaturedImage(false);
    setIsUploadingImage(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/jpeg",
      };
      const compressed = await imageCompression(imageFile, options);
      const formData = new FormData();
      formData.append("file", new File([compressed], `${Date.now()}.jpeg`));

      const result = await serverUploadImage(formData);

      if (result.success && result.url) {
        setValue("image", result.url);
        setValue("altText", altText);
      } else {
        setIsUploadingImageError(true);
      }
    } catch {
      setIsUploadingImageError(true);
    } finally {
      setImageFile(undefined);
      setAltText("");
      setIsUploadingImage(false);
    }
  };

  const onFormSubmit = (data: PostFormValues) => {
    onSubmit?.({
      metadata: data as PostMetadata,
      content: editorRef.current?.getHTML() ?? "",
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Action bar */}
        <div className="shrink-0 flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-baseline gap-2">
            <span className="line-clamp-1 text-lg font-semibold">
              {getValues("title") || postMetadata?.title || "Untitled Post"}
            </span>
            <span className="shrink-0 bg-gray-200 text-sm text-gray-500 px-2 py-1 rounded">
              {postMetadata ? "Editing Post" : "Creating Post"}
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDiscarding(true)}
              className="shrink-0 text-sm text-red-500 hover:text-red-900 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="shrink-0 lg:hidden flex items-center gap-1.5 text-sm text-gray-600"
            >
              <FaSliders className="w-3.5 h-3.5" />
              Details
            </button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(onFormSubmit)}
              className="shrink-0 px-5 py-2 rounded-lg text-sm"
            >
              {isSubmitting ? "Saving…" : "Save Post"}
            </Button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex-1 min-h-0 flex">
          {/* Editor column */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <RichTextEditor ref={editorRef} initialContent={postContent} />
          </div>

          {/* Backdrop: mobile only */}
          <div
            className={cn(
              `fixed inset-0 z-30 bg-black/40 lg:hidden`,
              `transition-opacity duration-300`,
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar: drawer on mobile, static panel on lg+ */}
          <aside
            className={cn(
              "w-80 shrink-0 overflow-y-auto scrollbar-thin space-y-4 p-4 border-l border-gray-200 bg-gray-50",
              "fixed inset-y-0 right-0 z-40 transition-transform duration-300 ease-in-out",
              "lg:static lg:inset-auto lg:z-auto lg:translate-x-0 lg:transition-none",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Drawer header: mobile only */}
            <div className="flex items-center justify-between pb-3 mb-1 border-b border-gray-200 lg:hidden">
              <span className="text-sm font-semibold">Post Details</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            {/* Post Details */}
            <div className="space-y-4">
              <p className="text-sm font-semibold hidden lg:block">
                Post Details
              </p>
              <TextInput
                label="Title"
                type="text"
                placeholder="Post title"
                error={errors.title?.message}
                required
                {...register("title")}
              />
              <TextInput
                label="Slug"
                type="text"
                placeholder="post-slug"
                error={errors.slug?.message}
                required
                {...register("slug")}
              />
              <Textarea
                label="Description"
                placeholder="Short description"
                className="min-h-20"
                error={errors.description?.message}
                {...register("description")}
              />
              <TextInput
                label="Tags (comma separated)"
                type="text"
                placeholder="tag-1, tag-2"
                error={errors.tags?.message}
                {...register("tags")}
              />
              <TextInput
                label="Keywords (comma separated)"
                type="text"
                placeholder="keyword-1, keyword-2"
                error={errors.keywords?.message}
                {...register("keywords")}
              />
              <TextInput
                label="Category"
                type="text"
                placeholder="Category"
                error={errors.category?.message}
                {...register("category")}
              />
              <TextInput
                label="Author"
                type="text"
                placeholder="Author name"
                error={errors.author?.message}
                {...register("author")}
              />
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <p className="text-sm font-semibold">Featured Image</p>

              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                {featuredImage ? (
                  <NextImage
                    src={featuredImage}
                    alt={featuredAltText || ""}
                    width={640}
                    height={360}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <FaImage className="w-8 h-8" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              <TextInput
                label="Alt Text"
                type="text"
                placeholder="Describe the image"
                error={errors.altText?.message}
                {...register("altText")}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsUploadFeaturedImage(true)}
                className="w-full py-2 rounded-lg text-sm"
              >
                Upload Image
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Featured image upload modal */}
      <Modal
        open={isUploadFeaturedImage}
        onOpenChange={(open) => {
          if (!open) setIsUploadFeaturedImage(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Upload Featured Image</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <FileUpload
                label="Image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
              <TextInput
                label="Alt Text"
                type="text"
                placeholder="Describe the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button
                variant="secondary"
                className="px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </Button>
            </ModalClose>
            <Button
              className="px-4 py-2 rounded-lg text-sm"
              onClick={handleUploadFeaturedImage}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Featured image upload error */}
      <Modal
        open={isUploadingImageError}
        onOpenChange={(open) => {
          if (!open) setIsUploadingImageError(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Error</ModalTitle>
            <ModalDescription>
              There was an error uploading your image.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="px-4 py-2 rounded-lg text-sm">
                Understood
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Featured image uploading in-progress */}
      <Modal
        open={isUploadingImage}
        onOpenChange={(open) => {
          if (!open) setIsUploadingImage(false);
        }}
      >
        <ModalContent closeOnBackdropClick={false} closeOnEscape={false}>
          <ModalHeader>
            <ModalTitle>Uploading Image</ModalTitle>
            <ModalDescription>
              Please wait while your image is being uploaded.
            </ModalDescription>
          </ModalHeader>
        </ModalContent>
      </Modal>

      {/* Discard confirmation */}
      <Modal
        open={discarding}
        onOpenChange={(open) => {
          if (!open) setDiscarding(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Discard Changes</ModalTitle>
            <ModalDescription>
              Are you sure you want to discard the changes?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button
                variant="secondary"
                className="px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </Button>
            </ModalClose>
            <Button
              className="px-4 py-2 rounded-lg text-sm"
              onClick={() => router.back()}
            >
              Discard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostEditor;
