import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { SlugGenerator } from "@/features/tools/slug-generator/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Slug Generator", href: "/tools/slug-generator" },
];

export default function SlugGeneratorPage() {
  return (
    <>
      <Header
        title="Slug Generator"
        description="Turn any title or phrase into a clean, URL-safe slug."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <SlugGenerator />
      </Section>
    </>
  );
}
