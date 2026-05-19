import { count, desc, eq } from "drizzle-orm";

import { db } from "./index";
import { type MaintenanceSetting, maintenanceSettings } from "./schema";

export type { MaintenanceSetting };
/** @deprecated Use MaintenanceSetting from schema instead */
export type MaintenanceSettingsData = MaintenanceSetting;

export async function getMaintenanceStatus(): Promise<MaintenanceSetting> {
  try {
    const result = await db
      .select()
      .from(maintenanceSettings)
      .orderBy(desc(maintenanceSettings.created_at))
      .limit(1);

    return result[0] ?? ({ enabled: false } as MaintenanceSetting);
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    throw error;
  }
}

export async function updateMaintenanceStatus(
  settings: Partial<MaintenanceSetting>
) {
  try {
    const result = await db
      .insert(maintenanceSettings)
      .values({
        enabled: settings.enabled ?? false,
        start_time: settings.start_time,
        end_time: settings.end_time,
        message: settings.message,
        allowed_ips: settings.allowed_ips ?? [],
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    throw error;
  }
}

export async function deleteMaintenanceStatus(
  settings: Pick<MaintenanceSetting, "id">
) {
  try {
    await db
      .delete(maintenanceSettings)
      .where(eq(maintenanceSettings.id, settings.id));
  } catch (error) {
    console.error("Error deleting maintenance status:", error);
    throw error;
  }
}

export async function getAllMaintenanceStatuses({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<{
  statuses: MaintenanceSetting[];
  total: number;
  page: number;
}> {
  const currentPage = page ?? 1;
  const currentLimit = limit ?? 10;
  const offset = (currentPage - 1) * currentLimit;

  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(maintenanceSettings)
        .orderBy(desc(maintenanceSettings.created_at))
        .limit(currentLimit)
        .offset(offset),
      db.select({ count: count() }).from(maintenanceSettings),
    ]);

    return {
      statuses: rows,
      total: totalResult[0].count,
      page: currentPage,
    };
  } catch (error) {
    console.error("Error fetching all maintenance statuses:", error);
    throw error;
  }
}
