import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { CodeHighlighter } from "@/features/tools/code-highlighter/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Code Highlighter", href: "/tools/code-highlighter" },
];

export default function CodeHighlighterPage() {
  return (
    <>
      <Header
        title="Code Highlighter"
        description="Paste code, choose a language, and copy the syntax-highlighted HTML to embed anywhere."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <CodeHighlighter />
      </Section>
    </>
  );
}
