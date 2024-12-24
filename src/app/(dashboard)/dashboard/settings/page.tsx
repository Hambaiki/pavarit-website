import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MaintenanceModeModule from "@/components/dashboard/settings/MaintenanceModeModule";
import MaintenanceEntries from "@/components/dashboard/settings/MaintenanceEntries";

export default function MaintenanceSettings() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>Settings</h1>
          <p>Manage website settings.</p>
        </div>
      </header>

      <MaintenanceModeModule className="mt-8" />

      <MaintenanceEntries className="mt-8" />
    </MainContainer>
  );
}
