"use client";

import { useEffect, useState } from "react";

import Switch from "@/components/form/Switch";
import Button from "@/components/Button";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";

interface MaintenanceModeModuleProps {
  className?: string;
}

function MaintenanceModeModule({ className }: MaintenanceModeModuleProps) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [settingsChanged, setSettingsChanged] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    enabled: false,
    scheduled: false,
    startTime: null,
    endTime: null,
    message: "",
    allowedIPs: "",
  });

  const [settings, setSettings] = useState({
    enabled: false,
    scheduled: false,
    startTime: null,
    endTime: null,
    message: "",
    allowedIPs: "",
  });

  useEffect(init, []);

  useEffect(() => {
    if (!settings.scheduled) {
      setSettings({ ...settings, startTime: null, endTime: null });
    }
  }, [settings.scheduled]);

  useEffect(() => {
    if (JSON.stringify(initialSettings) !== JSON.stringify(settings)) {
      setSettingsChanged(true);
    } else {
      setSettingsChanged(false);
    }
  }, [initialSettings, settings]);

  function init() {
    setLoading(true);

    const promiseAll = Promise.all([fetchSettings()]);

    promiseAll.finally(() => {
      setLoading(false);
    });
  }

  async function fetchSettings() {
    setLoading(true);

    try {
      const response = await fetch("/api/v1/settings/maintenance", {
        method: "GET",
      });
      const data = await response.json();

      const settings = {
        enabled: data.enabled,
        scheduled: data.start_time && data.end_time,
        startTime: data.start_time,
        endTime: data.end_time,
        message: data.message || "",
        allowedIPs: data.allowed_ips ? data.allowed_ips.join(",") : "",
      };

      setInitialSettings(settings);
      setSettings(settings);
    } catch (error) {
      console.error("Error fetching maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleMaintenanceMode(enabled: boolean) {
    const response = await fetch("/api/v1/settings/maintenance", {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });

    // const data = await response.json();

    if (response.ok) {
      fetchSettings();
    } else {
      throw new Error("Failed to toggle maintenance mode");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const allowedIPs = String(settings.allowedIPs)
        .split(",")
        .filter((ip) => ip !== "")
        .map((ip) => ip.trim());

      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: settings.enabled,
          startTime: settings.scheduled ? settings.startTime : null,
          endTime: settings.scheduled ? settings.endTime : null,
          message: settings.message,
          allowedIPs: allowedIPs,
        }),
      });

      if (response.ok) {
        fetchSettings();
      } else {
        throw new Error("Failed to update maintenance settings");
      }
    } catch (error) {
      console.error("Error updating maintenance settings:", error);
    } finally {
      setUpdating(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className={`${className}`}>
      <h2>Maintenance Mode</h2>
      <p className="text-gray-300 mt-2">
        Maintenance mode is a feature that allows you to put your website in
        maintenance mode. This will disable the website for all users.
      </p>

      <div className="mt-4 p-4 bg-gray-900 rounded-xl">
        <div className="flex flex-row justify-between space-x-2">
          <div className="flex flex-col">
            <h3 className="text-suzuha-teal-500">
              Enabled Maintenance Mode
            </h3>
            <p className="text-gray-300 mt-2">
              Toggle the maintenance mode on or off.
            </p>
          </div>

          <Switch
            on={settings.enabled}
            onChange={(on) => handleToggleMaintenanceMode(on)}
          />
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-850 rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between space-x-2">
            <span className="text-base">Schedule Maintenance</span>
            <Switch
              on={settings.scheduled}
              onChange={(on) => setSettings({ ...settings, scheduled: on })}
            />
          </div>

          <CollapsibleContainer collapsed={!settings.scheduled}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="datetime-local"
                name="startTime"
                value={settings.startTime || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-950"
              />
              <input
                type="datetime-local"
                name="endTime"
                value={settings.endTime || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-950"
              />
            </div>
          </CollapsibleContainer>

          <div className="flex flex-col space-y-2 mt-6">
            <label>
              <span className="text-base">Maintenance Message</span>
              <textarea
                placeholder="Enter your message here..."
                value={settings.message || ""}
                name="message"
                onChange={handleChange}
                className="w-full mt-2 p-4 min-h-[10rem] bg-gray-950 placeholder:text-gray-500 rounded-lg"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2 mt-6">
            <label>
              <span className="text-base">Allowed IPs</span>
              <input
                type="text"
                value={settings.allowedIPs}
                onChange={handleChange}
                name="allowedIPs"
                className="w-full mt-2 p-2 rounded bg-gray-950"
                placeholder="127.0.0.1, 192.168.1.1,..."
              />
            </label>
          </div>

          <CollapsibleContainer collapsed={!settingsChanged}>
            <div className="flex flex-row justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setSettings(initialSettings)}
                className="px-4 py-2 rounded-lg text-red-500 border border-red-500  hover:bg-red-500/10 transition-colors"
              >
                Discard Changes
              </button>
              <Button
                type="submit"
                className="px-4 py-2 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 rounded-lg"
              >
                Save Settings
              </Button>
            </div>
          </CollapsibleContainer>
        </form>
      </div>
    </div>
  );
}

export default MaintenanceModeModule;
