"use client";

import { useEffect, useState } from "react";

import { FaCheck, FaClock, FaX } from "react-icons/fa6";

import { MaintenanceSettingsData } from "@/lib/db/maintenance";

import Paginator from "@/components/Paginator";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/navigation/Spinner";
import Button from "@/components/Button";
import { FaQuestionCircle, FaSync } from "react-icons/fa";

interface MaintenanceEntryProps {
  className?: string;
}

function MaintenanceEntry({ className }: MaintenanceEntryProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const perPage = 10;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [maintenanceStatuses, setMaintenanceStatuses] = useState<
    MaintenanceSettingsData[]
  >([]);

  useEffect(() => {
    fetchAllMaintenanceStatuses(page);
  }, [page]);

  async function fetchAllMaintenanceStatuses(page: number) {
    setLoading(true);
    try {
      const request = {
        page: page,
        limit: perPage,
        settings: {},
      };

      const response = await fetch("/api/v1/settings/maintenance", {
        method: "POST",
        body: JSON.stringify(request),
      });
      const data = await response.json();

      setMaintenanceStatuses(data.statuses);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching all maintenance statuses:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${className} w-full`}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Entry</h2>
        <Button
          variant="secondary"
          onClick={() => fetchAllMaintenanceStatuses(page)}
          className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {loading || maintenanceStatuses.length === 0 ? (
        <div className="mt-4 flex justify-center items-center h-[30rem] bg-neutral-900 rounded-xl">
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaQuestionCircle className="w-20 h-20 text-neutral-300" />
              <p className="text-xl text-neutral-300">No data</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900">
          <table className="w-full rounded-xl overflow-hidden bg-neutral-900">
            <thead>
              <tr className="text-center text-neutral-300 text-sm bg-neutral-950">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Enabled</th>
                <th className="px-4 py-2 min-w-[8rem]">Created At</th>
                <th className="px-4 py-2 min-w-[8rem]">Start Time</th>
                <th className="px-4 py-2 min-w-[8rem]">End Time</th>
                <th className="px-4 py-2 min-w-[20rem]">Message</th>
                <th className="px-4 py-2">Allowed IPs</th>
              </tr>
            </thead>
            <tbody className="text-center text-neutral-300 text-sm divide-y divide-neutral-800">
              {maintenanceStatuses.map((status) => (
                <tr key={status.id}>
                  <td className="px-4 py-2">{status.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      {status.enabled ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaX className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {status.created_at ? (
                      <>
                        {new Date(status.created_at).toLocaleDateString()}
                        <br />
                        {new Date(status.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {status.start_time ? (
                      <>
                        {new Date(status.start_time).toLocaleDateString()}
                        <br />
                        {new Date(status.start_time).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {status.end_time ? (
                      <>
                        {new Date(status.end_time).toLocaleDateString()}
                        <br />
                        {new Date(status.end_time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">{status.message || "N/A"}</td>
                  <td className="px-4 py-2">
                    {status.allowed_ips && status.allowed_ips.length > 0
                      ? status.allowed_ips?.join(", ")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {maintenanceStatuses.length > 0 && (
        <div className="flex justify-center mt-4">
          <Paginator currentPage={page} maxPage={Math.ceil(total / perPage)} />
        </div>
      )}
    </div>
  );
}

export default MaintenanceEntry;
