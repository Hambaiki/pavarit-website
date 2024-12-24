import { Metadata } from "next";
import { getMaintenanceStatus } from "@/lib/db/maintenance";

export async function generateMetadata(): Promise<Metadata> {
  const maintenance = await getMaintenanceStatus();

  return {
    title: "Site Maintenance",
    description:
      maintenance.message || "We are currently performing maintenance.",
  };
}

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const maintenance = await getMaintenanceStatus();
  const message = searchParams.message || maintenance.message;

  const estimatedDowntime = maintenance.end_time
    ? new Date(maintenance.end_time).getTime() - Date.now()
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="mb-8">Site Maintenance</h1>

        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
          <div className="animate-pulse mb-6">
            <span className="text-6xl">🔧</span>
          </div>

          <p className="text-xl mb-4">
            {message || "We are currently performing scheduled maintenance."}
          </p>

          {estimatedDowntime && estimatedDowntime > 0 && (
            <p className="text-suzuha-teal-500">
              Estimated completion in:{" "}
              {Math.ceil(estimatedDowntime / (1000 * 60))} minutes
            </p>
          )}

          <div className="mt-8 text-neutral-400">
            <p>We apologize for any inconvenience.</p>
            <p>Please check back soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
