import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { CodeIDE } from "@/features/tools/code-ide/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Code IDE", href: "/tools/code-ide" },
];

export default function CodeIDEPage() {
  return (
    <>
      <Header
        title="Code IDE"
        description="A simple code editor for writing and editing code."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <CodeIDE />
      </Section>
    </>
  );
}
