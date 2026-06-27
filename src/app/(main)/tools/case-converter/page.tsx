import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { CaseConverter } from "@/features/tools/case-converter/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Case Converter", href: "/tools/case-converter" },
];

export default function CaseConverterPage() {
  return (
    <>
      <Header
        title="Case Converter"
        description="Type or paste text and instantly see every case variant with one-click copy."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <CaseConverter />
      </Section>
    </>
  );
}
