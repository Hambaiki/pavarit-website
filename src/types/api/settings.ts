export interface MaintenanceSettingsData {
  id: number;
  enabled: boolean;
  start_time?: string | null;
  end_time?: string | null;
  message?: string | null;
  allowed_ips?: string[];
  created_at: string;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}

export interface MaintenanceResponse extends CommonResponse {
  settings: MaintenanceSettingsData;
}

export interface MaintenanceStatusesResponse extends CommonResponse {
  statuses: MaintenanceSettingsData[];
  total: number;
  page: number;
}
