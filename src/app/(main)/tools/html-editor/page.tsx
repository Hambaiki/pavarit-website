import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { HtmlEditor } from "@/features/tools/html-editor/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "HTML Editor", href: "/tools/html-editor" },
];

export default function HtmlEditorPage() {
  return (
    <>
      <Header
        title="HTML Editor"
        description="Edit rich text or raw HTML."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <HtmlEditor />
      </Section>
    </>
  );
}
