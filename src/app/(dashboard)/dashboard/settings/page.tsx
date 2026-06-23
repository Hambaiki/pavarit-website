import { Suspense } from "react";

import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import MaintenanceEntries from "@/components/dashboard/settings/MaintenanceEntries";
import MaintenanceModeModule from "@/components/dashboard/settings/MaintenanceModeModule";

export default function MaintenanceSettings() {
  return (
    <>
      <Header title="Settings" description="Manage website settings." />

      <Section>
        <Suspense>
          <MaintenanceModeModule className="mt-8" />
        </Suspense>
      </Section>

      <Section>
        <Suspense>
          <MaintenanceEntries className="mt-8" />
        </Suspense>
      </Section>
    </>
  );
}
