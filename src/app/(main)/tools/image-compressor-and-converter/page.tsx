import { Section } from "@/components/content";
import { Header } from "@/components/content";
import { ImageCompressorAndConverter } from "@/features/tools/image-compressor-and-converter/components";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Image Compressor & Converter", href: "/tools/image-compressor" },
];

export default function ImageCompressorAndConverterPage() {
  return (
    <>
      <Header
        title="Image Compressor & Converter"
        description="Compress and convert images in bulk, entirely in your browser. Nothing leaves your device."
        breadcrumbs={breadcrumbs}
      />

      <Section >
        <ImageCompressorAndConverter />
      </Section>
    </>
  );
}
