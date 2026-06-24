"use client";

import { useMemo, useState } from "react";

import { FaCheck, FaCopy } from "react-icons/fa6";

import { slugify } from "@/lib/string";

const WORDS_PER_MINUTE = 200;

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return minutes <= 1 ? "< 1 min" : `${minutes} min`;
}

export default function SlugGenerator() {
  const [input, setInput] = useState("My Example Blog Post Title");
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(input), [input]);

  const wordCount = useMemo(
    () => input.trim().split(/\s+/).filter(Boolean).length,
    [input]
  );

  const charCount = input.length;
  const rt = useMemo(() => readingTime(input), [input]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 px-4 py-2 border-b border-gray-200 bg-gray-50">
          <span className="text-xs font-mono text-gray-500">Input</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-4 text-base focus:outline-none"
          placeholder="Enter a title or phrase…"
        />
      </div>
      {/* Slug output */}
      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Slug</p>
          <p className="text-sm font-mono break-all text-gray-900">
            {slug || <span className="text-gray-300">-</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!slug}
          className="shrink-0 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors"
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
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Words", value: wordCount },
          { label: "Characters", value: charCount },
          { label: "Reading time", value: rt },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-4 border border-gray-200 rounded-xl bg-white text-center"
          >
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
