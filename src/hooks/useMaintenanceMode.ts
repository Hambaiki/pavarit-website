'use client';

import { useState, useEffect } from "react";
import { MaintenanceSettings } from "@/lib/db/maintenance";

export function useMaintenanceMode() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance status');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newSettings: Partial<MaintenanceSettings>) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update maintenance status');
      
      const data = await response.json();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateStatus,
    refreshStatus: fetchStatus
  };
} 