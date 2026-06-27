"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";
import { FaCheck, FaCopy } from "react-icons/fa6";

import { Select } from "@/components/form/v2/Select";

const LANGUAGES = [
  { label: "Auto-detect", value: "auto" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "HTML", value: "xml" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
  { label: "Bash", value: "bash" },
  { label: "JSON", value: "json" },
  { label: "SQL", value: "sql" },
  { label: "Markdown", value: "markdown" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Java", value: "java" },
  { label: "C / C++", value: "cpp" },
];

const SAMPLE = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

export default function CodeHighlighter() {
  const [code, setCode] = useState(SAMPLE);
  const [lang, setLang] = useState("auto");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const highlightedHtml = useRef("");

  useEffect(() => {
    if (!codeRef.current || !code) return;

    codeRef.current.removeAttribute("data-highlighted");
    codeRef.current.textContent = code;

    if (lang === "auto") {
      hljs.highlightElement(codeRef.current);
    } else {
      codeRef.current.className = `language-${lang}`;
      hljs.highlightElement(codeRef.current);
    }

    highlightedHtml.current = codeRef.current.outerHTML;
  }, [code, lang]);

  const handleCopyCode = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, [code]);

  const handleCopyHtml = useCallback(async () => {
    await navigator.clipboard.writeText(
      `<pre><code>${highlightedHtml.current}</code></pre>`
    );
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Input pane */}
      <div className="flex-1 flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <span className="text-xs font-mono text-gray-500">Code</span>
          <div className="flex items-center gap-2">
            <Select
              value={lang}
              onChange={setLang}
              options={LANGUAGES}
              className="text-xs py-1 min-w-36"
            />
            <button
              type="button"
              onClick={handleCopyCode}
              disabled={!code}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
            >
              {copiedCode ? (
                <FaCheck className="w-3 h-3 text-green-600" />
              ) : (
                <FaCopy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 min-h-112 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Paste code here…"
        />
      </div>

      {/* Output pane */}
      <div className="flex-1 flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-tr-xl">
          <span className="text-xs font-mono text-gray-500">Highlighted</span>
          <button
            type="button"
            onClick={handleCopyHtml}
            disabled={!code}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
          >
            {copiedHtml ? (
              <>
                <FaCheck className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Copied HTML</span>
              </>
            ) : (
              <>
                <FaCopy className="w-3 h-3" />
                Copy HTML
              </>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-950 rounded-br-xl">
          {code ? (
            <pre className="p-4 text-sm leading-relaxed">
              <code
                ref={codeRef}
                className={lang !== "auto" ? `language-${lang}` : ""}
              />
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Start typing to see highlighted output
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
