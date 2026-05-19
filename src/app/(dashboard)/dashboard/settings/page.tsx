import MainHeader from "@/components/common/MainHeader";
import MainContainer from "@/components/dashboard/common/MainContainer";
import MaintenanceEntries from "@/components/dashboard/settings/MaintenanceEntries";
import MaintenanceModeModule from "@/components/dashboard/settings/MaintenanceModeModule";

export default function MaintenanceSettings() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <MainContainer>
      <MainHeader
        title="Settings"
        description="Manage website settings."
        breadcrumbs={breadcrumbs}
      />

      <MaintenanceModeModule className="mt-8" />

      <MaintenanceEntries className="mt-8" />
    </MainContainer>
  );
}
