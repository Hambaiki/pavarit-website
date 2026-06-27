"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

import hljs from "highlight.js/lib/common";

import { languageForFilename } from "../lib/languageForFilename";

interface CodeEditorProps {
  path: string;
  content: string;
  onChange: (content: string) => void;
}

export default function CodeEditor({
  path,
  content,
  onChange,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const lang = languageForFilename(path);

  // Re-highlight whenever content or the file (and therefore language)
  // changes. We rebuild textContent + re-run hljs rather than trying to
  // diff/patch, since highlight.js owns the DOM inside <code> once it runs.
  useEffect(() => {
    if (!codeRef.current) return;
    codeRef.current.removeAttribute("data-highlighted");
    codeRef.current.textContent = content;
    codeRef.current.className = lang === "plaintext" ? "" : `language-${lang}`;
    if (lang !== "plaintext") {
      hljs.highlightElement(codeRef.current);
    }
  }, [content, lang]);

  // Keep the highlighted backdrop scrolled in lockstep with the textarea,
  // since they're stacked on top of each other and must move as one.
  const syncScroll = () => {
    if (!textareaRef.current || !preRef.current) return;
    preRef.current.scrollTop = textareaRef.current.scrollTop;
    preRef.current.scrollLeft = textareaRef.current.scrollLeft;
  };

  // Reset scroll position when switching files so the new file doesn't
  // open mid-scroll from wherever the previous file happened to be.
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.scrollTop = 0;
    if (preRef.current) preRef.current.scrollTop = 0;
  }, [path]);

  // Shared box-model values for both layers. Using exact px/numeric values
  // (rather than relying on two different elements — <pre>/<code> vs
  // <textarea> — to resolve the same Tailwind utility identically) removes
  // any room for the two layers to drift apart line by line.
  const sharedTextStyle: CSSProperties = {
    margin: 0,
    padding: "16px",
    fontSize: "14px",
    lineHeight: "21px",
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    tabSize: 2,
    whiteSpace: "pre",
    wordBreak: "normal",
    overflowWrap: "normal",
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-gray-950">
      <pre
        ref={preRef}
        aria-hidden
        className="absolute inset-0 overflow-auto pointer-events-none"
        style={sharedTextStyle}
      >
        {/* Reset highlight.js's own padding/display rules on code.hljs —
            its stylesheet adds 1em (theme) + 3px/5px (base) of padding
            that stacks on top of this wrapper's padding, which is what
            was pushing the highlighted text out of alignment with the
            textarea underneath it. */}
        <code
          ref={codeRef}
          className={lang !== "plaintext" ? `language-${lang}` : ""}
          style={{ padding: 0, display: "inline", background: "none" }}
        />
        {/* Trailing newline so the last line has the same height as the
            textarea's caret on an empty final line. */}
        {"\n"}
      </pre>
      <textarea
        id={"code-editor-textarea"}
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        wrap="off"
        className="absolute inset-0 overflow-auto resize-none bg-transparent text-transparent caret-white focus:outline-none"
        style={sharedTextStyle}
      />
    </div>
  );
}
