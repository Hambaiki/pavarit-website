"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FaTrash } from "react-icons/fa6";

import Button from "@/components/Button";
import { Section } from "@/components/content";
import { Header } from "@/components/content";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import RichTextEditor, {
  RichTextEditorHandle,
} from "@/features/blog/components/editor/RichTextEditor";

const STORAGE_KEY = "scratchpad";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Scratchpad", href: "/tools/scratchpad" },
];

export default function ScratchpadPage() {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [initialContent, setInitialContent] = useState<string | undefined>();
  const [confirmClear, setConfirmClear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setInitialContent(saved ?? "");
    setLoaded(true);
  }, []);

  const handleChange = useCallback((html: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, html);
      setSavedAt(new Date());
    }, 800);
  }, []);

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setInitialContent("");
    setSavedAt(null);
    setConfirmClear(false);
  };

  return (
    <>
      <Header
        title="Scratchpad"
        description="A shared writing utility from my collection, with private browser-based auto-save."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="flex-1 min-h-0 overflow-hidden border border-gray-200 bg-white/50 rounded-xl">
          <div className="flex items-center justify-between gap-3 p-4 shrink-0 border-b border-gray-200 bg-gray-50">
            <span className="text-xs font-mono text-gray-500">Scratchpad</span>
            {savedAt && (
              <span className="text-xs text-gray-400">
                Saved {savedAt.toLocaleTimeString()}
              </span>
            )}
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <FaTrash className="w-3 h-3" />
              Clear
            </button>
          </div>

          {loaded && (
            <RichTextEditor
              ref={editorRef}
              initialContent={initialContent}
              imageMode="url"
              onChange={handleChange}
            />
          )}
        </div>
      </Section>

      <Modal
        open={confirmClear}
        onOpenChange={(open) => {
          if (!open) setConfirmClear(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Clear Scratchpad</ModalTitle>
            <ModalDescription>
              This will permanently erase all content. It cannot be undone.
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
              onClick={handleClear}
            >
              Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
