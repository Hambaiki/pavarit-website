"use client";

import { useCallback, useEffect, useState } from "react";

import { marked } from "marked";
import { FaCheck, FaCode, FaCopy, FaEye } from "react-icons/fa6";

import { formatHtml } from "@/lib/formatHtml";

const SAMPLE = `# Hello World

Write **bold**, *italic*, or \`inline code\`.

## Lists

- Item one
- Item two
  - Nested item

## Code block

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> A blockquote to test the converter.
`;

async function markdownToHtml(md: string): Promise<string> {
  return await marked(md, { gfm: true });
}

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [tab, setTab] = useState<"preview" | "source">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    markdownToHtml(markdown).then(setHtml);
  }, [markdown]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Markdown input */}
      <div className="flex-1 flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 px-4 py-2 border-b border-gray-200 bg-gray-50">
          <span className="text-xs font-mono text-gray-500">Markdown</span>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="flex-1 min-h-112 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Type Markdown here…"
        />
      </div>

      {/* Output pane */}
      <div className="flex-1 flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                tab === "preview"
                  ? "bg-white shadow-sm text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FaEye className="w-3 h-3" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setTab("source")}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                tab === "source"
                  ? "bg-white shadow-sm text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FaCode className="w-3 h-3" />
              HTML
            </button>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!html}
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
                Copy HTML
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "preview" ? (
            <div
              className="prose max-w-none p-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap break-all leading-relaxed">
              {formatHtml(html)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
