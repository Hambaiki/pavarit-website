"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FaQuestionCircle, FaSync } from "react-icons/fa";

import { InquiryData } from "@/types/api/inquiries";

import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import Spinner from "@/components/navigation/Spinner";

interface OnlineInquiryEntriesProps {
  className?: string;
}

function OnlineInquiryEntries({ className }: OnlineInquiryEntriesProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [inquiries, setInquiries] = useState<InquiryData[]>([]);

  useEffect(() => {
    fetchAllMaintenanceStatuses(page);
  }, [page]);

  async function fetchAllMaintenanceStatuses(page: number) {
    setLoading(true);
    try {
      const request = {
        page: page,
        limit: limit,
        settings: {},
      };

      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(request),
      });
      const data = await response.json();

      setInquiries(data.inquiries);
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
        <h3>Inquiries</h3>
        <Button
          variant="secondary"
          onClick={() => fetchAllMaintenanceStatuses(page)}
          className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="mt-4 rounded-xl overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-850">
        <table className="w-full rounded-xl overflow-hidden bg-gray-850">
          <thead>
            <tr className="text-center text-gray-300 text-sm bg-gray-800">
              <th className="px-4 py-2 min-w-[8rem]">Created At</th>
              <th className="px-4 py-2 min-w-[10rem]">Name</th>
              <th className="px-4 py-2 min-w-[10rem]">Email</th>
              <th className="px-4 py-2 min-w-[8rem]">Phone</th>
              <th className="px-4 py-2 min-w-[8rem]">Subject</th>
              <th className="px-4 py-2 min-w-[20rem]">Message</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-300 text-sm divide-y divide-gray-800">
            {!loading &&
              inquiries.length > 0 &&
              (inquiries.length < limit
                ? [
                    ...inquiries,
                    ...Array(limit - inquiries.length).fill(undefined),
                  ]
                : inquiries
              ).map((inquiry, index) => (
                <tr key={index} className="h-[4rem]">
                  {inquiry && (
                    <>
                      <td className="px-4 py-2">
                        {inquiry.created_at ? (
                          <>
                            {new Date(inquiry.created_at).toLocaleDateString()}
                            <br />
                            {new Date(inquiry.created_at).toLocaleTimeString(
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
                      <td className="px-4 py-2">{inquiry.name}</td>
                      <td className="px-4 py-2">{inquiry.email}</td>
                      <td className="px-4 py-2 min-w-[8rem]">
                        {inquiry.phone}
                      </td>
                      <td className="px-4 py-2 min-w-[8rem]">
                        {inquiry.subject}
                      </td>
                      <td className="px-4 py-2 min-w-[20rem]">
                        {inquiry.message}
                      </td>
                    </>
                  )}
                </tr>
              ))}

            {(loading || inquiries.length === 0) && (
              <tr
                className={`w-full bg-gray-850 rounded-xl`}
                style={{ height: `${4 * limit}rem` }}
              >
                <td colSpan={7} className="text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <FaQuestionCircle className="w-20 h-20 text-gray-300" />
                        <p className="text-xl text-gray-300">No data</p>
                        <Button
                          variant="secondary"
                          onClick={() => fetchAllMaintenanceStatuses(page)}
                          className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
                        >
                          <FaSync className="w-4 h-4" />
                          Retry
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Paginator
          currentPage={page}
          maxPage={Math.ceil(total / limit) || 1}
          shallow
        />
      </div>
    </div>
  );
}

export default OnlineInquiryEntries;
