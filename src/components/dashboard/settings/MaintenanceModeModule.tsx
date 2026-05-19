"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/Button";
import CollapsibleContainer from "@/components/container/CollapsibleContainer";
import Switch from "@/components/form/v1/Switch";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const maintenanceSchema = z.object({
  scheduled: z.boolean(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  message: z.string().optional(),
  allowedIPs: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

interface MaintenanceModeModuleProps {
  className?: string;
}

function MaintenanceModeModule({ className }: MaintenanceModeModuleProps) {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      scheduled: false,
      startTime: null,
      endTime: null,
      message: "",
      allowedIPs: "",
    },
  });

  const scheduled = useWatch({ control, name: "scheduled" });
  const startTime = useWatch({ control, name: "startTime" });
  const endTime = useWatch({ control, name: "endTime" });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!scheduled) {
      setValue("startTime", null);
      setValue("endTime", null);
    }
  }, [scheduled, setValue]);

  async function fetchSettings() {
    setLoading(true);

    try {
      const response = await fetch("/api/v1/settings/maintenance", {
        method: "GET",
      });
      const data = await response.json();

      const values: MaintenanceFormValues = {
        scheduled: !!(data.start_time && data.end_time),
        startTime: data.start_time ?? null,
        endTime: data.end_time ?? null,
        message: data.message || "",
        allowedIPs: data.allowed_ips ? data.allowed_ips.join(",") : "",
      };

      setEnabled(data.enabled);
      reset(values);
    } catch (error) {
      console.error("Error fetching maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleMaintenanceMode(on: boolean) {
    const response = await fetch("/api/v1/settings/maintenance", {
      method: "PATCH",
      body: JSON.stringify({ enabled: on }),
    });

    if (response.ok) {
      setEnabled(on);
    } else {
      throw new Error("Failed to toggle maintenance mode");
    }
  }

  async function onSubmit(data: MaintenanceFormValues) {
    const allowedIPs = String(data.allowedIPs || "")
      .split(",")
      .filter((ip) => ip !== "")
      .map((ip) => ip.trim());

    const response = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled,
        startTime: data.scheduled ? data.startTime : null,
        endTime: data.scheduled ? data.endTime : null,
        message: data.message,
        allowedIPs,
      }),
    });

    if (response.ok) {
      await fetchSettings();
    } else {
      console.error("Failed to update maintenance settings");
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <h3>Maintenance Mode</h3>
      <p className="text-gray-600 mt-2">
        Maintenance mode is a feature that allows you to put your website in
        maintenance mode. This will disable the website for all users.
      </p>

      <Card className="mt-4 p-4">
        <div className="flex flex-row justify-between space-x-2">
          <div className="flex flex-col">
            <h3 className="text-primary-500">Enabled Maintenance Mode</h3>
            <p className="text-gray-600 mt-2">
              Toggle the maintenance mode on or off.
            </p>
          </div>

          <Switch on={enabled} onChange={handleToggleMaintenanceMode} />
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-between space-x-2">
            <span className="text-base">Schedule Maintenance</span>
            <Switch
              on={scheduled}
              onChange={(on) =>
                setValue("scheduled", on, { shouldDirty: true })
              }
            />
          </div>

          <CollapsibleContainer collapsed={!scheduled}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="datetime-local"
                className="w-full px-4 py-2 rounded bg-white/80 border border-gray-200"
                {...register("startTime")}
                value={startTime ?? ""}
              />
              <input
                type="datetime-local"
                className="w-full px-4 py-2 rounded bg-white/80 border border-gray-200"
                {...register("endTime")}
                value={endTime ?? ""}
              />
            </div>
          </CollapsibleContainer>

          <div className="flex flex-col space-y-2 mt-6">
            <label>
              <span className="text-base">Maintenance Message</span>
              <textarea
                placeholder="Enter your message here..."
                className="w-full mt-2 p-4 min-h-40 bg-white/80 border border-gray-200 placeholder:text-gray-500 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register("message")}
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2 mt-6">
            <label>
              <span className="text-base">Allowed IPs</span>
              <input
                type="text"
                className="w-full mt-2 p-2 rounded bg-white/80 border border-gray-200 focus:outline-none
                  focus:ring-2 focus:ring-primary-500"
                placeholder="127.0.0.1, 192.168.1.1,..."
                {...register("allowedIPs")}
              />
            </label>
          </div>

          <CollapsibleContainer collapsed={!isDirty}>
            <div className="flex flex-row justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 rounded-lg text-red-500 border border-red-500 hover:bg-red-500/10 transition-colors"
              >
                Discard Changes
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg"
              >
                Save Settings
              </Button>
            </div>
          </CollapsibleContainer>
        </form>
      </Card>
    </div>
  );
}

export default MaintenanceModeModule;
