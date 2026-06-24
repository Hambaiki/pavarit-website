"use client";

import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { MarkdownConverter } from "@/features/tools/markdown-converter/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Markdown Converter", href: "/tools/markdown" },
];

export default function MarkdownPage() {
  return (
    <>
      <Header
        title="Markdown Converter"
        description="Write Markdown on the left, get a rendered preview or raw HTML on the right."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <MarkdownConverter />
      </Section>
    </>
  );
}
