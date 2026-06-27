"use client";

import { useMemo, useState } from "react";

import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from "change-case";
import { FaCheck, FaCopy } from "react-icons/fa6";

const VARIANTS = [
  { label: "camelCase", fn: camelCase },
  { label: "PascalCase", fn: pascalCase },
  { label: "snake_case", fn: snakeCase },
  { label: "kebab-case", fn: kebabCase },
  { label: "CONSTANT_CASE", fn: constantCase },
  { label: "Capital Case", fn: capitalCase },
  { label: "Sentence case", fn: sentenceCase },
  { label: "dot.case", fn: dotCase },
  { label: "path/case", fn: pathCase },
  { label: "no case", fn: noCase },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className="shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
    >
      {copied ? (
        <FaCheck className="w-3 h-3 text-green-600" />
      ) : (
        <FaCopy className="w-3 h-3" />
      )}
    </button>
  );
}

export default function CaseConverter() {
  const [input, setInput] = useState("hello world example text");

  const results = useMemo(
    () => VARIANTS.map(({ label, fn }) => ({ label, value: fn(input) })),
    [input]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col border border-gray-200 bg-white/50 rounded-xl overflow-hidden">
        <div className="shrink-0 px-4 py-2 border-b border-gray-200 bg-gray-50">
          <span className="text-xs font-mono text-gray-500">Input</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="p-4 text-sm leading-relaxed resize-none focus:outline-none bg-white/50"
          placeholder="Type or paste text here…"
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-mono truncate text-gray-900">
                {value || <span className="text-gray-300">-</span>}
              </p>
            </div>
            <CopyButton value={value} />
          </div>
        ))}
      </div>
    </div>
  );
}
