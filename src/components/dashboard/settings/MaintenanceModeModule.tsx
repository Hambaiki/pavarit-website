"use client";

import { useEffect, useState } from "react";

import Switch from "@/components/form/Switch";
import Button from "@/components/Button";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import Spinner from "@/components/navigation/Spinner";

interface MaintenanceModeModuleProps {
  className?: string;
}

function MaintenanceModeModule({ className }: MaintenanceModeModuleProps) {
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (JSON.stringify(initialSettings) !== JSON.stringify(settings)) {
      setSettingsChanged(true);
    } else {
      setSettingsChanged(false);
    }
  }, [initialSettings, settings]);

  function init() {
    setLoading(true);

    const promiseAll = Promise.all([
      fetchSettings(),
      fetchAllMaintenanceStatuses(),
    ]);

    promiseAll.finally(() => {
      setLoading(false);
    });
  }

  async function fetchSettings() {
    setLoading(true);

    try {
      const response = await fetch("/api/maintenance");
      const data = await response.json();

      const settings = {
        enabled: data.enabled,
        scheduled: data.scheduled,
        startTime: data.start_time,
        endTime: data.end_time,
        message: data.message,
        allowedIPs: data.allowed_ips,
      };

      setInitialSettings(settings);
      setSettings(settings);
    } catch (error) {
      console.error("Error fetching maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  }

  // async function deleteMaintenanceStatus(id: number) {
  //   try {
  //     const response = await fetch("/api/v1/settings/maintenance", {
  //       method: "DELETE",
  //       body: JSON.stringify({
  //         id,
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error deleting maintenance status:", error);
  //   }
  // }

  async function fetchAllMaintenanceStatuses() {
    try {
      const response = await fetch("/api/v1/settings/maintenance", {
        method: "POST",
        body: JSON.stringify({
          page: 1,
          limit: 10,
          settings: {},
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching all maintenance statuses:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setUpdating(true);

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: settings.enabled,
          startTime: settings.scheduled ? settings.startTime : null,
          endTime: settings.scheduled ? settings.endTime : null,
          message: settings.message,
          allowedIPs: settings.allowedIPs
            ? String(settings.allowedIPs)
                .split(",")
                .map((ip) => ip.trim())
                .filter((ip) => ip !== "")
            : [],
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
      <h2 className="text-2xl font-bold">Maintenance Mode</h2>
      <p className="text-neutral-300 mt-2">
        Maintenance mode is a feature that allows you to put your website in
        maintenance mode. This will disable the website for all users.
      </p>

      <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
        {loading || updating ? (
          <div className="flex flex-row justify-center items-center p-32">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row justify-between space-x-2">
              <span className="text-base">Enable Maintenance Mode</span>
              <Switch
                on={settings.enabled}
                onChange={(on) => setSettings({ ...settings, enabled: on })}
              />
            </div>

            <div className="flex flex-row justify-between space-x-2 mt-4">
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
                  className="w-full px-4 py-2 rounded bg-neutral-950"
                />
                <input
                  type="datetime-local"
                  name="endTime"
                  value={settings.endTime || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-neutral-950"
                />
              </div>
            </CollapsibleContainer>

            <div className="flex flex-col space-y-2 mt-6">
              <label>
                <span className="text-base">Maintenance Message</span>
                <textarea
                  value={settings.message || ""}
                  name="message"
                  onChange={handleChange}
                  className="w-full mt-2 p-4 min-h-[10rem] bg-neutral-950 rounded-lg"
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
                  className="w-full mt-2 p-2 rounded bg-neutral-950"
                  placeholder="127.0.0.1, 192.168.1.1,..."
                />
              </label>
            </div>

            <CollapsibleContainer collapsed={!settingsChanged}>
              <div className="flex flex-row justify-end mt-6">
                <Button
                  type="submit"
                  className="px-4 py-2 bg-suzuha-teal-500 hover:bg-suzuha-teal-600 rounded-lg"
                >
                  Save Settings
                </Button>
              </div>
            </CollapsibleContainer>
          </form>
        )}
      </div>
    </div>
  );
}

export default MaintenanceModeModule;
