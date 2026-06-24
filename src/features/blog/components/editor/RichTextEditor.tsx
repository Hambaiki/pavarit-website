"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

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
import {
  FaBold,
  FaCode,
  FaDivide,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaYoutube,
} from "react-icons/fa6";

import Button from "@/components/Button";
import { FileUpload, TextInput } from "@/components/form/v2";
import Loading from "@/components/navigation/Loading";
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
import { slugify } from "@/lib/string";

import { serverUploadImage } from "../../actions";
import ToolbarButton from "./ToolbarButton";

export interface RichTextEditorHandle {
  getHTML: () => string;
}

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  imageMode?: "upload" | "url";
  className?: string;
}

const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.id = slugify(node.textContent);
    return ["h" + node.attrs.level, HTMLAttributes, 0];
  },
});

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    { initialContent, onChange, imageMode = "upload", className },
    ref
  ) {
    const [url, setUrl] = useState("");
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

    // upload mode
    const [altText, setAltText] = useState("");
    const [imageFile, setImageFile] = useState<File>();
    const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
    const [isUploadingImageError, setIsUploadingImageError] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // url mode
    const [imageUrl, setImageUrl] = useState("");
    const [imageUrlAlt, setImageUrlAlt] = useState("");
    const [isImageUrlModalOpen, setIsImageUrlModalOpen] = useState(false);

    const [height, setHeight] = useState(480);
    const [width, setWidth] = useState(640);
    const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState("");

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: false }),
        HeadingWithId.configure({ levels: [1, 2, 3, 4, 5, 6] }),
        Image,
        Link.configure({ openOnClick: false }),
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        Youtube.configure({ controls: false, nocookie: true }),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: `prose max-w-none min-h-[60vh] px-8 py-6 focus:outline-none${className ? ` ${className}` : ""}`,
        },
      },
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() ?? "",
    }));

    useEffect(() => {
      if (editor && initialContent !== undefined) {
        editor.commands.setContent(initialContent);
      }
    }, [initialContent, editor]);

    const handleUploadImage = async (file: File): Promise<string | null> => {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: "image/jpeg",
        };
        const compressed = await imageCompression(file, options);
        const formData = new FormData();
        formData.append("file", new File([compressed], `${Date.now()}.jpeg`));

        const result = await serverUploadImage(formData);
        if (!result.success || !result.url) {
          throw new Error("Image upload failed");
        }
        return result.url;
      } catch {
        return null;
      }
    };

    const handleAddImage = (
      imageUrl: string,
      alt: string,
      targetEditor: Editor
    ) => {
      targetEditor.chain().focus().setImage({ src: imageUrl, alt }).run();
    };

    const handleConfirmUploadImage = async () => {
      if (!imageFile || !editor) return;

      setIsUploadImageOpen(false);
      setIsUploadingImage(true);

      try {
        const imageUrl = await handleUploadImage(imageFile);
        if (imageUrl) {
          handleAddImage(imageUrl, altText, editor);
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

    const handleAddYoutubeVideo = () => {
      if (!youtubeUrl || !editor) return;
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: Math.max(320, width) || 640,
        height: Math.max(180, height) || 480,
      });
      setIsYoutubeModalOpen(false);
      setYoutubeUrl("");
    };

    if (!editor) return <Loading />;

    return (
      <>
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="shrink-0 flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
            <ToolbarButton
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            >
              <FaBold className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            >
              <FaItalic className="w-3.5 h-3.5" />
            </ToolbarButton>

            <span
              className="block w-px h-4 bg-gray-300 mx-1"
              aria-hidden="true"
            />

            <ToolbarButton
              title="Heading 1"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
            >
              <span className="text-xs font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton
              title="Heading 2"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
            >
              <span className="text-xs font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              title="Heading 3"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", { level: 3 })}
            >
              <span className="text-xs font-bold">H3</span>
            </ToolbarButton>

            <span
              className="block w-px h-4 bg-gray-300 mx-1"
              aria-hidden="true"
            />

            <ToolbarButton
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
            >
              <FaListUl className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
            >
              <FaListOl className="w-3.5 h-3.5" />
            </ToolbarButton>

            <span
              className="block w-px h-4 bg-gray-300 mx-1"
              aria-hidden="true"
            />

            <ToolbarButton
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
            >
              <FaQuoteLeft className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
            >
              <FaCode className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Horizontal rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <FaDivide className="w-3.5 h-3.5" />
            </ToolbarButton>

            <span
              className="block w-px h-4 bg-gray-300 mx-1"
              aria-hidden="true"
            />

            <ToolbarButton
              title="Insert image"
              onClick={() =>
                imageMode === "url"
                  ? setIsImageUrlModalOpen(true)
                  : setIsUploadImageOpen(true)
              }
            >
              <FaImage className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Insert link"
              onClick={() => setIsUrlModalOpen(true)}
            >
              <FaLink className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton
              title="Embed YouTube video"
              onClick={() => setIsYoutubeModalOpen(true)}
            >
              <FaYoutube className="w-3.5 h-3.5" />
            </ToolbarButton>
          </div>

          {/* Editor surface */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Link modal */}
        <Modal
          open={isUrlModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsUrlModalOpen(false);
              setUrl("");
            }
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Insert Link</ModalTitle>
              <ModalDescription>Enter the URL to link to.</ModalDescription>
            </ModalHeader>
            <ModalBody>
              <TextInput
                label="URL"
                type="text"
                placeholder="https://…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
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
                onClick={() => {
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                    setIsUrlModalOpen(false);
                    setUrl("");
                  }
                }}
              >
                Insert
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* YouTube modal */}
        <Modal
          open={isYoutubeModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsYoutubeModalOpen(false);
              setYoutubeUrl("");
            }
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Embed YouTube Video</ModalTitle>
              <ModalDescription>
                Paste a YouTube URL and set the player dimensions.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <TextInput
                  label="YouTube URL"
                  type="text"
                  placeholder="https://youtube.com/watch?v=…"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput
                    label="Width (px)"
                    type="number"
                    min="320"
                    max="1024"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                  />
                  <TextInput
                    label="Height (px)"
                    type="number"
                    min="180"
                    max="720"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                  />
                </div>
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
                onClick={handleAddYoutubeVideo}
              >
                Embed
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Image URL modal */}
        {imageMode === "url" && (
          <Modal
            open={isImageUrlModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsImageUrlModalOpen(false);
                setImageUrl("");
                setImageUrlAlt("");
              }
            }}
          >
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Insert Image</ModalTitle>
                <ModalDescription>Enter the URL of the image.</ModalDescription>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <TextInput
                    label="Image URL"
                    type="text"
                    placeholder="https://…"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <TextInput
                    label="Alt Text"
                    type="text"
                    placeholder="Describe the image"
                    value={imageUrlAlt}
                    onChange={(e) => setImageUrlAlt(e.target.value)}
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
                  onClick={() => {
                    if (imageUrl && editor) {
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: imageUrl, alt: imageUrlAlt })
                        .run();
                      setIsImageUrlModalOpen(false);
                      setImageUrl("");
                      setImageUrlAlt("");
                    }
                  }}
                >
                  Insert
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Image upload modal */}
        {imageMode === "upload" && (
          <>
            <Modal
              open={isUploadImageOpen}
              onOpenChange={(open) => {
                if (!open) setIsUploadImageOpen(false);
              }}
            >
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Upload Image</ModalTitle>
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
                    onClick={handleConfirmUploadImage}
                  >
                    Upload
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
          </>
        )}
      </>
    );
  }
);

export default RichTextEditor;
