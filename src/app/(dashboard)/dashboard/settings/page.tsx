import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import MaintenanceModeModule from "@/components/dashboard/settings/MaintenanceModeModule";
import MaintenanceEntry from "@/components/dashboard/settings/MaintenanceEntry";

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
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-neutral-300">Manage website settings.</p>
        </div>
      </header>

      <MaintenanceModeModule className="mt-8" />

      <MaintenanceEntry className="mt-8" />
    </MainContainer>
  );
}
