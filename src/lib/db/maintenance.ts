import { sql } from "./neon";

export interface MaintenanceSettingsData {
  id: number;
  enabled: boolean;
  start_time?: string | null;
  end_time?: string | null;
  message?: string | null;
  allowed_ips?: string[];
  created_at: string;
}

export async function getMaintenanceStatus(): Promise<MaintenanceSettingsData> {
  try {
    const result = await sql`
      SELECT * FROM maintenance_settings 
      ORDER BY created_at DESC 
      LIMIT 1
  `;

    return (result[0] as MaintenanceSettingsData) || { enabled: false };
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    throw error;
  }
}

export async function updateMaintenanceStatus(
  settings: Partial<MaintenanceSettingsData>
) {
  try {
    const result = await sql`
      INSERT INTO maintenance_settings (enabled, start_time, end_time, message, allowed_ips)
      VALUES (${settings.enabled}, ${settings.start_time}, ${settings.end_time}, ${settings.message}, ${settings.allowed_ips})
      RETURNING *
  `;

    return result[0];
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    throw error;
  }
}

export async function deleteMaintenanceStatus(
  settings: Partial<MaintenanceSettingsData>
) {
  try {
    await sql`DELETE FROM maintenance_settings WHERE id = ${settings.id}`;
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
  statuses: MaintenanceSettingsData[];
  total: number;
  page: number;
}> {
  const offset = ((page || 1) - 1) * (limit || 10);
  try {
    const result =
      await sql`SELECT * FROM maintenance_settings ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const total = await sql`SELECT COUNT(*) FROM maintenance_settings`;

    return {
      statuses: result as MaintenanceSettingsData[],
      total: total[0].count,
      page: page || 1,
    };
  } catch (error) {
    console.error("Error fetching all maintenance statuses:", error);
    throw error;
  }
}
