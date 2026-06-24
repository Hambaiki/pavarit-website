"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import hljs from "highlight.js/lib/core";
import hljsHtml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import { FaCheck, FaCopy } from "react-icons/fa6";

import { Section } from "@/components/content";
import Header from "@/components/content/Header";
import RichTextEditor from "@/features/blog/components/editor/RichTextEditor";
import { formatHtml } from "@/lib/formatHtml";

hljs.registerLanguage("html", hljsHtml);

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "HTML Editor", href: "/tools/html-editor" },
];

export default function HtmlEditorPage() {
  const [editorHtml, setEditorHtml] = useState("");
  const [sourceHtml, setSourceHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const syncingFromSourceRef = useRef(false);
  const codeRef = useRef<HTMLElement>(null);

  const formatted = useMemo(() => formatHtml(sourceHtml), [sourceHtml]);

  useEffect(() => {
    if (codeRef.current && formatted) {
      codeRef.current.removeAttribute("data-highlighted");
      codeRef.current.textContent = formatted;
      hljs.highlightElement(codeRef.current);
    }
  }, [formatted]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(sourceHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sourceHtml]);

  const handleEditorChange = useCallback((nextHtml: string) => {
    setEditorHtml(nextHtml);

    // Prevent immediate editor->source overwrite right after source->editor sync.
    if (syncingFromSourceRef.current) {
      syncingFromSourceRef.current = false;
      return;
    }

    setSourceHtml(nextHtml);
  }, []);

  const handleSourceChange = useCallback((value: string) => {
    syncingFromSourceRef.current = true;
    setSourceHtml(value);
    setEditorHtml(value);
  }, []);

  return (
    <>
      <Header
        title="HTML Editor"
        description="Edit rich text or raw HTML."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Editor pane */}
          <div className="flex-1 min-h-0 min-w-0 border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
            <RichTextEditor
              initialContent={editorHtml}
              onChange={handleEditorChange}
              imageMode="url"
            />
          </div>

          {/* HTML source + preview pane */}
          <div className="flex-1 min-h-0 min-w-0 flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
            <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-tr-xl">
              <span className="text-xs font-mono text-gray-500">
                HTML source
              </span>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!sourceHtml}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
              >
                {copied ? (
                  <>
                    <FaCheck className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col rounded-br-xl overflow-hidden">
              <textarea
                value={sourceHtml}
                onChange={(event) => handleSourceChange(event.target.value)}
                className="flex-1 min-h-55 p-4 font-mono text-xs leading-relaxed border-b border-gray-200 resize-none focus:outline-none"
                placeholder="Start typing to edit HTML source"
                spellCheck={false}
              />

              <div className="shrink-0 px-4 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-xs font-mono text-gray-500">
                  Formatted preview
                </span>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {sourceHtml ? (
                  <pre className="p-4 text-xs leading-relaxed overflow-x-auto">
                    <code
                      ref={codeRef}
                      className="language-html"
                      style={{ background: "transparent", color: "inherit" }}
                    />
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full p-4 text-sm text-gray-500">
                    Start typing on either side to sync content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
