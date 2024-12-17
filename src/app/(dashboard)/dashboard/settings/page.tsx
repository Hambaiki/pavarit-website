"use client";

import { useState, useEffect } from "react";

import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import Switch from "@/components/form/Switch";
import Button from "@/components/Button";

export default function MaintenanceSettings() {
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

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (JSON.stringify(initialSettings) !== JSON.stringify(settings)) {
      setSettingsChanged(true);
    } else {
      setSettingsChanged(false);
    }
  }, [initialSettings, settings]);

  function fetchSettings() {
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => {
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
      });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
            : [],
        }),
      });

      if (!response.ok)
        throw new Error("Failed to update maintenance settings");
    } catch (error) {
      console.error("Error updating maintenance settings:", error);
    }
  }

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Maintenance Mode</h2>
        <p className="text-neutral-300 mt-2">
          Maintenance mode is a feature that allows you to put your website in
          maintenance mode. This will disable the website for all users.
        </p>

        <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
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
                  value={settings.message}
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
        </div>
      </div>
    </MainContainer>
  );
}
