"use client";

import { useCallback, useRef, useState } from "react";

import imageCompression from "browser-image-compression";
import {
  FaArrowRight,
  FaArrowsRotate,
  FaCheck,
  FaCircleNotch,
  FaDownload,
  FaFileZipper,
  FaPlus,
  FaTrash,
  FaUpload,
} from "react-icons/fa6";

import { Section } from "@/components/content";
import Header from "@/components/content/Header";
import { TextInput } from "@/components/form/v2";
import { Label } from "@/components/form/v2/Label";
import { Select } from "@/components/form/v2/Select";
import { cn } from "@/lib/cn";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Image Compressor & Converter", href: "/tools/image-compressor" },
];

const FORMAT_OPTIONS = [
  { value: "same", label: "Same as input" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

const FORMAT_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const FORMAT_LABEL: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/bmp": "BMP",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  });
}

function getOutputMime(format: string, original: File): string {
  return format === "same" ? original.type || "image/jpeg" : format;
}

function getOutputExt(format: string, original: File): string {
  if (format === "same") return original.name.split(".").pop() ?? "jpg";
  return FORMAT_EXT[format] ?? "jpg";
}

type Status = "pending" | "processing" | "done" | "error";

interface BatchItem {
  id: string;
  original: { file: File; preview: string; width: number; height: number };
  output?: { file: File; preview: string; width: number; height: number };
  status: Status;
}

const CONCURRENCY = 3;
const MAX_FILES = 10;

export default function ImageCompressorAndConverterPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"zip" | "separate">("zip");
  const [isZipping, setIsZipping] = useState(false);

  const [outputFormat, setOutputFormat] = useState("same");
  const [quality, setQuality] = useState(80);
  const [maxSizeMB, setMaxSizeMB] = useState(0.5);
  const [maxDimension, setMaxDimension] = useState(1920);

  const isLossy = outputFormat !== "image/png";

  const processItem = useCallback(
    async (
      item: BatchItem,
      fmt: string,
      q: number,
      sizeMB: number,
      dim: number
    ) => {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing" } : i))
      );
      try {
        const mime = getOutputMime(fmt, item.original.file);
        const result = await imageCompression(item.original.file, {
          maxSizeMB: sizeMB,
          maxWidthOrHeight: dim,
          useWebWorker: true,
          fileType: mime,
          initialQuality: q / 100,
        });
        const preview = URL.createObjectURL(result);
        const { width, height } = await getDimensions(preview);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  output: { file: result, preview, width, height },
                }
              : i
          )
        );
      } catch {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error" } : i))
        );
      }
    },
    []
  );

  const processQueue = useCallback(
    async (
      queue: BatchItem[],
      fmt: string,
      q: number,
      sizeMB: number,
      dim: number
    ) => {
      const chunks: BatchItem[][] = [];
      for (let i = 0; i < queue.length; i += CONCURRENCY) {
        chunks.push(queue.slice(i, i + CONCURRENCY));
      }
      for (const chunk of chunks) {
        await Promise.all(
          chunk.map((item) => processItem(item, fmt, q, sizeMB, dim))
        );
      }
    },
    [processItem]
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      if (!imageFiles.length) return;

      const slots = MAX_FILES - items.length;
      if (slots <= 0) return;
      const accepted = imageFiles.slice(0, slots);

      const newItems: BatchItem[] = await Promise.all(
        accepted.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const { width, height } = await getDimensions(preview);
          return {
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
            original: { file, preview, width, height },
            status: "pending" as Status,
          };
        })
      );

      setItems((prev) => [...prev, ...newItems]);
      processQueue(newItems, outputFormat, quality, maxSizeMB, maxDimension);
    },
    [outputFormat, quality, maxSizeMB, maxDimension, processQueue]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleReprocessAll = () => {
    const reset = items.map((i) => ({
      ...i,
      status: "pending" as Status,
      output: undefined,
    }));
    setItems(reset);
    processQueue(reset, outputFormat, quality, maxSizeMB, maxDimension);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const downloadItem = (item: BatchItem) => {
    if (!item.output) return;
    const ext = getOutputExt(outputFormat, item.original.file);
    const a = document.createElement("a");
    a.href = item.output.preview;
    a.download = `${item.original.file.name.replace(/\.[^.]+$/, "")}-compressed.${ext}`;
    a.click();
  };

  const downloadAllSeparate = () => {
    items
      .filter((i) => i.status === "done")
      .forEach((item, idx) => setTimeout(() => downloadItem(item), idx * 200));
  };

  const downloadAllZip = async () => {
    const done = items.filter((i) => i.status === "done" && i.output);
    if (!done.length) return;
    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      await Promise.all(
        done.map(async (item) => {
          const ext = getOutputExt(outputFormat, item.original.file);
          const filename = `${item.original.file.name.replace(/\.[^.]+$/, "")}-compressed.${ext}`;
          const blob = await fetch(item.output!.preview).then((r) => r.blob());
          zip.file(filename, blob);
        })
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed-images.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  };

  const doneCount = items.filter((i) => i.status === "done").length;
  const processingCount = items.filter((i) => i.status === "processing").length;
  const totalSaved = items
    .filter((i) => i.status === "done" && i.output)
    .reduce((acc, i) => acc + (i.original.file.size - i.output!.file.size), 0);

  return (
    <>
      <Header
        title="Image Compressor & Converter"
        description="Compress and convert images in bulk, entirely in your browser. Nothing leaves your device."
        breadcrumbs={breadcrumbs}
      />

      <Section className="space-y-5">
        {/* ── Pipeline card: Input → Output ──────────────────────── */}
        <div className="card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
            {/* Input side */}
            <div className="p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Input
              </p>

              {/* Drop zone */}
              <div
                onDrop={
                  items.length < MAX_FILES
                    ? handleDrop
                    : (e) => e.preventDefault()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  if (items.length < MAX_FILES) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() =>
                  items.length < MAX_FILES && inputRef.current?.click()
                }
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-2.5 rounded-xl transition-all duration-200 select-none border-2 border-dashed",
                  items.length === 0 ? "py-8" : "py-4",
                  items.length >= MAX_FILES
                    ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
                    : isDragging
                      ? "cursor-pointer border-primary-400 bg-primary-50"
                      : "cursor-pointer border-gray-200 hover:border-primary-300 hover:bg-primary-50/30"
                )}
              >
                {items.length === 0 ? (
                  <>
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                        isDragging
                          ? "bg-primary-100 text-primary-500"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      <FaUpload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        {isDragging
                          ? "Drop to upload"
                          : "Drop images or click to browse"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        JPEG · PNG · WebP · GIF · BMP
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {items.length >= MAX_FILES ? (
                      <span>
                        Limit reached - {MAX_FILES}/{MAX_FILES}
                      </span>
                    ) : (
                      <>
                        <FaPlus className="w-3 h-3 text-primary-400" />
                        <span>
                          {isDragging
                            ? "Drop to add"
                            : `Add more - ${items.length}/${MAX_FILES} used`}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* Arrow divider */}
            <div className="hidden md:flex items-center justify-center px-2 text-gray-200">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px flex-1 bg-gray-200" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 shrink-0">
                  <FaArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-px flex-1 bg-gray-200" />
              </div>
            </div>
            <div className="md:hidden h-px bg-gray-100 mx-5" />

            {/* Output / settings side */}
            <div className="p-5 space-y-4 bg-gray-50/60">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Output settings
                </p>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReprocessAll}
                    className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <FaArrowsRotate className="w-3 h-3" />
                    Re-process all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Format"
                  value={outputFormat}
                  onChange={setOutputFormat}
                  options={FORMAT_OPTIONS}
                />
                <Select
                  label="Max file size"
                  value={String(maxSizeMB)}
                  onChange={(v) => setMaxSizeMB(parseFloat(v))}
                  options={[0.1, 0.25, 0.5, 1, 2].map((v) => ({
                    value: String(v),
                    label: `${v} MB`,
                  }))}
                />
                <div className="sm:col-span-2">
                  <Select
                    label="Max dimension"
                    value={String(maxDimension)}
                    onChange={(v) => setMaxDimension(parseInt(v))}
                    options={[640, 1024, 1280, 1920, 2560, 4096].map((v) => ({
                      value: String(v),
                      label: `${v} px`,
                    }))}
                  />
                </div>
              </div>

              {isLossy && (
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <div className="flex items-center gap-2">
                    {[25, 50, 75, 90, 100].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setQuality(preset)}
                        className={cn(
                          "flex-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors duration-150",
                          quality === preset
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {preset}%
                      </button>
                    ))}
                    <TextInput
                      type="number"
                      min={1}
                      max={100}
                      value={quality}
                      onChange={(e) =>
                        setQuality(
                          Math.min(
                            100,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="w-16 px-2 py-3 text-xs text-center border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Batch summary ───────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3 px-1">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">
                {doneCount} of {items.length} done
              </span>
              {processingCount > 0 && (
                <span className="flex items-center gap-1.5 text-primary-500 text-xs">
                  <FaCircleNotch className="w-3 h-3 animate-spin" />
                  {processingCount} processing
                </span>
              )}
              {totalSaved > 0 && (
                <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                  <FaCheck className="w-3 h-3" />
                  {formatBytes(totalSaved)} saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {doneCount > 1 && (
                <>
                  {/* Mode toggle */}
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setDownloadMode("zip")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 font-medium transition-colors",
                        downloadMode === "zip"
                          ? "bg-primary-500 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      <FaFileZipper className="w-3 h-3" />
                      ZIP
                    </button>
                    <button
                      type="button"
                      onClick={() => setDownloadMode("separate")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 font-medium transition-colors border-l border-gray-200",
                        downloadMode === "separate"
                          ? "bg-primary-500 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      <FaDownload className="w-3 h-3" />
                      Separate
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isZipping}
                    onClick={
                      downloadMode === "zip"
                        ? downloadAllZip
                        : downloadAllSeparate
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-wait text-white text-sm font-medium transition-colors"
                  >
                    {isZipping ? (
                      <FaCircleNotch className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FaDownload className="w-3.5 h-3.5" />
                    )}
                    {isZipping ? "Zipping…" : `Download all (${doneCount})`}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setItems([])}
                className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* File queue */}
        {items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((item) => {
              const saving = item.output
                ? Math.round(
                    (1 - item.output.file.size / item.original.file.size) * 100
                  )
                : null;
              const outputMime = getOutputMime(
                outputFormat,
                item.original.file
              );

              return (
                <div
                  key={item.id}
                  className={cn(
                    "card h-28 rounded-2xl overflow-hidden transition-all duration-300 border border-gray-200",
                    item.status === "done" && "border-green-200",
                    item.status === "error" && "border-red-200",
                    item.status === "processing" && "border-primary-200"
                  )}
                >
                  <div className="flex items-stretch gap-0 h-full">
                    {/* Thumbnail */}
                    <div className="shrink-0 w-36 bg-gray-100 overflow-hidden border-r border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.output?.preview ?? item.original.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between gap-2">
                      {/* Top row: filename + remove */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate leading-snug">
                          {item.original.file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Stats row: before → after */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Before */}
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 leading-none mb-0.5">
                            Before
                          </span>
                          <span className="text-xs text-gray-600 font-mono">
                            {formatBytes(item.original.file.size)}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {item.original.width}×{item.original.height}
                          </span>
                        </div>

                        <FaArrowRight className="w-3 h-3 text-gray-300 shrink-0" />

                        {/* After */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs text-gray-400 leading-none">
                              After
                            </span>
                            <span className="text-xs px-1 py-px rounded bg-gray-100 text-gray-400 font-mono leading-none">
                              {FORMAT_LABEL[outputMime] ??
                                outputMime.split("/")[1].toUpperCase()}
                            </span>
                          </div>
                          {item.output ? (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono font-semibold text-gray-800">
                                  {formatBytes(item.output.file.size)}
                                </span>
                                {saving !== null && saving > 0 && (
                                  <span className="text-xs font-semibold text-green-600">
                                    −{saving}%
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 font-mono">
                                {item.output.width}×{item.output.height}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-300 font-mono">
                              -
                            </span>
                          )}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Status / action */}
                        <div className="shrink-0">
                          {item.status === "pending" && (
                            <span className="text-xs text-gray-400 px-2.5 py-1 rounded-lg bg-gray-100">
                              Queued
                            </span>
                          )}
                          {item.status === "processing" && (
                            <span className="flex items-center gap-1.5 text-xs text-primary-600 px-2.5 py-1 rounded-lg bg-primary-50">
                              <FaCircleNotch className="w-3 h-3 animate-spin" />
                              Processing
                            </span>
                          )}
                          {item.status === "error" && (
                            <span className="text-xs text-red-500 px-2.5 py-1 rounded-lg bg-red-50">
                              Failed
                            </span>
                          )}
                          {item.status === "done" && (
                            <button
                              type="button"
                              onClick={() => downloadItem(item)}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors"
                            >
                              <FaDownload className="w-3 h-3" />
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
