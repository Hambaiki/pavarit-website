"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { FaSync } from "react-icons/fa";
import { FaCheck, FaX } from "react-icons/fa6";

import Button from "@/components/Button";
import { ColumnDef } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/cn";
import { MaintenanceSetting } from "@/lib/db/schema";

interface MaintenanceEntriesProps {
  className?: string;
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "N/A";
  const d = new Date(value);
  return (
    <>
      {d.toLocaleDateString()}
      <br />
      {d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </>
  );
}

const columns: ColumnDef<MaintenanceSetting>[] = [
  { header: "ID", render: (row) => row.id },
  {
    header: "Enabled",
    render: (row) => (
      <div className="flex justify-center items-center">
        {row.enabled ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaX className="text-red-500" />
        )}
      </div>
    ),
  },
  {
    header: "Created At",
    minWidth: "min-w-32",
    render: (row) => formatDateTime(row.created_at),
  },
  {
    header: "Start Time",
    minWidth: "min-w-32",
    render: (row) => formatDateTime(row.start_time),
  },
  {
    header: "End Time",
    minWidth: "min-w-32",
    render: (row) => formatDateTime(row.end_time),
  },
  {
    header: "Message",
    minWidth: "min-w-80",
    render: (row) => row.message || "N/A",
  },
  {
    header: "Allowed IPs",
    render: (row) =>
      row.allowed_ips && row.allowed_ips.length > 0
        ? row.allowed_ips.join(", ")
        : "N/A",
  },
];

function MaintenanceEntries({ className }: MaintenanceEntriesProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [maintenanceStatuses, setMaintenanceStatuses] = useState<
    MaintenanceSetting[]
  >([]);

  useEffect(() => {
    fetchMaintenanceStatuses(page);
  }, [page]);

  async function fetchMaintenanceStatuses(page: number) {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/settings/maintenance", {
        method: "POST",
        body: JSON.stringify({ page, limit, settings: {} }),
      });
      const data = await response.json();
      setMaintenanceStatuses(data.statuses);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching maintenance statuses:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-row items-center justify-between">
        <h3>Maintenance Entry</h3>
        <Button
          variant="secondary"
          onClick={() => fetchMaintenanceStatuses(page)}
          className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={maintenanceStatuses}
        loading={loading}
        total={total}
        currentPage={page}
        limit={limit}
        onRetry={() => fetchMaintenanceStatuses(page)}
      />
    </div>
  );
}

export default MaintenanceEntries;
