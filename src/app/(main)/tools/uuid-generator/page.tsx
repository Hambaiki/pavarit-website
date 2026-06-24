"use client";

import { useCallback, useState } from "react";

import { FaCheck, FaCopy, FaRotate } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

import { Section } from "@/components/content";
import { Header } from "@/components/content";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "UUID Generator", href: "/tools/uuid-generator" },
];

const COUNTS = [1, 5, 10, 25];

function generate(count: number, upper: boolean, hyphens: boolean): string[] {
  return Array.from({ length: count }, () => {
    let id = uuidv4();
    if (!hyphens) id = id.replace(/-/g, "");
    if (upper) id = id.toUpperCase();
    return id;
  });
}

function UUIDRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
      <span className="flex-1 font-mono text-sm text-gray-800 select-all break-all">
        {value}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
      >
        {copied ? (
          <FaCheck className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <FaCopy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState(() => generate(5, false, true));
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = useCallback(() => {
    setUuids(generate(count, upper, hyphens));
  }, [count, upper, hyphens]);

  const handleCopyAll = useCallback(async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }, [uuids]);

  return (
    <>
      <Header
        title="UUID Generator"
        description="Generate v4 UUIDs in bulk with configurable formatting."
        breadcrumbs={breadcrumbs}
      />

      <Section className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <label className="flex flex-col gap-1">
            <span>Count</span>
            <div className="flex gap-1">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    count === n
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </label>

          <div className="flex flex-col gap-1">
            <span>Formatting</span>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={upper}
                onChange={(e) => setUpper(e.target.checked)}
                className="rounded"
              />
              Uppercase
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded"
              />
              Hyphens
            </label>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors ml-auto"
          >
            <FaRotate className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>

        {/* UUID list */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
            <span className="text-xs font-mono text-gray-500">
              {uuids.length} UUID{uuids.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              {copiedAll ? (
                <>
                  <FaCheck className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <FaCopy className="w-3 h-3" />
                  Copy all
                </>
              )}
            </button>
          </div>
          {uuids.map((id) => (
            <UUIDRow key={id} value={id} />
          ))}
        </div>
      </Section>
    </>
  );
}
