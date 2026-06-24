import { Metadata } from "next";

import {
  FaBook,
  FaCode,
  FaFileCode,
  FaFingerprint,
  FaFont,
  FaImage,
  FaLink,
  FaPenToSquare,
} from "react-icons/fa6";

import Button from "@/components/Button";
import OptionMenuGrid from "@/components/common/OptionMenuGrid";
import { Section } from "@/components/content";
import { Header } from "@/components/content";
import Card from "@/components/ui/Card";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
];

const toolItems = [
  {
    title: "HTML Editor",
    description:
      "Compose rich content, inspect clean HTML output, and reuse it across projects.",
    href: "/tools/html-editor",
    icon: FaCode,
  },
  {
    title: "Scratchpad",
    description:
      "A quick private workspace for notes, drafts, and experiments that auto-save locally.",
    href: "/tools/scratchpad",
    icon: FaPenToSquare,
  },
  {
    title: "Markdown Converter",
    description:
      "Write Markdown and get a rendered preview or clean HTML output ready to use anywhere.",
    href: "/tools/markdown",
    icon: FaFileCode,
  },
  {
    title: "Case Converter",
    description:
      "Instantly convert text between camelCase, snake_case, kebab-case, and 7 other formats.",
    href: "/tools/case-converter",
    icon: FaFont,
  },
  {
    title: "Slug Generator",
    description:
      "Turn any title into a URL-safe slug with live word count, character count, and reading time.",
    href: "/tools/slug-generator",
    icon: FaLink,
  },
  {
    title: "Image Compressor",
    description:
      "Compress images in your browser with configurable quality and dimension limits. Nothing leaves your device.",
    href: "/tools/image-compressor",
    icon: FaImage,
  },
  {
    title: "UUID Generator",
    description:
      "Generate v4 UUIDs in bulk with options for uppercase formatting and hyphen removal.",
    href: "/tools/uuid-generator",
    icon: FaFingerprint,
  },
  {
    title: "Code Highlighter",
    description:
      "Paste code, pick a language, and copy the syntax-highlighted HTML to embed in any page.",
    href: "/tools/code-highlighter",
    icon: FaCode,
  },
];

export const metadata: Metadata = {
  title: "Tool Collection | Pavarit's Website",
  description:
    "A curated collection of useful tools developed from this codebase and beyond, shared for showcase and practical use.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/tools`,
  },
};

export default function ToolsPage() {
  return (
    <>
      <Header
        title="Tool Collection"
        description="A curated set of things I built from this codebase and other projects that felt useful enough to share."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <Card as="div" className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <FaBook className="h-5 w-5 text-primary-500" />
            <h2>Why this collection exists</h2>
          </div>
          <p>
            This page is my public shelf for practical features and experiments.
            Some started here, some came from other codebases, and each one is
            included because it proved useful in real workflows.
          </p>
          <div className="pt-2">
            <Button
              href="/contact"
              className="px-4 py-2 rounded-lg"
              variant="secondary"
            >
              Suggest a Tool
            </Button>
          </div>
        </Card>
      </Section>

      <Section>
        <h2>Featured Tools</h2>
        <p className="mt-4">
          Explore the current set below. I will keep expanding this collection
          whenever I build something worth showcasing or reusing.
        </p>

        <OptionMenuGrid items={toolItems} />
      </Section>
    </>
  );
}
