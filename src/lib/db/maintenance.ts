import { sql } from "./neon";

export interface MaintenanceSettings {
  enabled: boolean;
  start_time?: Date | null;
  end_time?: Date | null;
  message?: string | null;
  allowed_ips?: string[];
}

// SQL to create the table (run this in your database)
/*
CREATE TABLE maintenance_settings (
  id SERIAL PRIMARY KEY,
  enabled BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  message TEXT,
  allowed_ips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/

export async function getMaintenanceStatus(): Promise<MaintenanceSettings> {
  const result = await sql`
    SELECT * FROM maintenance_settings 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  return (result[0] as MaintenanceSettings) || { enabled: false };
}

export async function updateMaintenanceStatus(
  settings: Partial<MaintenanceSettings>
) {
  const result = await sql`
    INSERT INTO maintenance_settings (enabled, start_time, end_time, message, allowed_ips)
    VALUES (${settings.enabled}, ${settings.start_time}, ${settings.end_time}, ${settings.message}, ${settings.allowed_ips})
    RETURNING *
  `;

  return result[0];
}
