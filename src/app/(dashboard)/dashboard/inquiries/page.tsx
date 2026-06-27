import { Suspense } from "react";

import { Header } from "@/components/content";
import Section from "@/components/content/Section";
import InquiryEntries from "@/features/dashboard/components/inquiries/InquiryEntries";

export default function Inquiries() {
  return (
    <>
      <Header title="Inquiries" description="View all inquiries." />

      <Section>
        <Suspense>
          <InquiryEntries />
        </Suspense>
      </Section>
    </>
  );
}
