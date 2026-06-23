import { Suspense } from "react";

import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import OnlineInquiryEntries from "@/components/dashboard/online-inquiries/OnlineInquiryEntries";

export default function MaintenanceSettings() {
  return (
    <>
      <Header title="Online Inquiries" description="View all inquiries." />

      <Section>
        <Suspense>
          <OnlineInquiryEntries />
        </Suspense>
      </Section>
    </>
  );
}
